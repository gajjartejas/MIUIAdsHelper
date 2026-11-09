import React, { memo, ReactElement, useEffect, useRef } from 'react';
import { AppState, Appearance, View } from 'react-native';

//App Modules
import styles from './styles';
import AppearancePreferences = Appearance.AppearancePreferences;
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';
import i18n from 'app/locales';
import useAppLangConfigStore from 'app/store/appLangConfig';
import { endConnection, ErrorCode, Purchase, purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
import NavigationService, { navigationRef } from 'app/navigation/NavigationService';
import { useTranslation } from 'react-i18next';
import { connectBilling } from 'app/services/billing';
import { billingCode, billingFailure, reportBillingError } from 'app/services/billingDiagnostics';
import productIds from 'app/assets/data/purchase-products.json';
import analytics from 'app/services/analytics';
import { completePurchaseEntitlement, restorePurchaseEntitlement } from 'app/services/purchaseEntitlements';
import { showAppDialog } from 'app/store/dialogStore';

//Interface
export type Props = {
  children: ReactElement[] | ReactElement;
};

const AppManager = ({ children }: Props) => {
  const setIsDarkMode = useThemeConfigStore(store => store.setIsDarkMode);
  const appearance = useThemeConfigStore(store => store.appearance);
  const selectedLanguageCode = useAppLangConfigStore(store => store.selectedLanguageCode);
  const { t } = useTranslation();
  const translation = useRef(t);
  useEffect(() => {
    translation.current = t;
  }, [t]);

  useEffect(() => {
    let active = true;
    const refreshEntitlement = async () => {
      try {
        await connectBilling();
        if (active) await restorePurchaseEntitlement();
      } catch {
        // The billing service reports diagnostics. Keep cached access on query failure.
      }
    };

    // Attach listeners before querying purchases so updates cannot be missed
    // while startup or foreground reconciliation is in progress.
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
      if (!active || !productIds.includes(purchase.productId)) return;
      if (purchase.purchaseState === 'pending') {
        showAppDialog(translation.current('iap_pending'));
        return;
      }
      if (purchase.purchaseState !== 'purchased') {
        reportBillingError('listener', billingFailure(ErrorCode.PurchaseVerificationFailed), purchase.productId);
        showAppDialog(translation.current('iap_purchase_not_verified'));
        return;
      }
      try {
        const entitled = await completePurchaseEntitlement(purchase);
        if (!active || !entitled) return;
        analytics().logEvent('iap_purchase_success', { productId: purchase.productId });
        const returnToApp = () => {
          if (navigationRef.current?.getCurrentRoute()?.name === 'Purchase') NavigationService.goBack();
        };
        showAppDialog('', translation.current('iap_purchased_success'), [{ text: 'OKAY', onPress: returnToApp }], {
          onDismiss: returnToApp,
        });
      } catch (error) {
        reportBillingError('listener', error, purchase.productId);
        if (active) {
          showAppDialog(translation.current('iap_purchase_not_verified'));
          await refreshEntitlement();
        }
      }
    });

    const purchaseErrorSubscription = purchaseErrorListener(error => {
      const code = billingCode(error);
      reportBillingError('listener', error, error.productId ?? undefined);
      if (!active || code === ErrorCode.UserCancelled) return;
      if (code === ErrorCode.AlreadyOwned) {
        refreshEntitlement();
      } else if (code === ErrorCode.Pending || code === ErrorCode.DeferredPayment) {
        showAppDialog(translation.current('iap_pending'));
      } else {
        showAppDialog(translation.current('iap_purchase_not_verified'));
      }
    });
    const foregroundSubscription = AppState.addEventListener('change', state => {
      if (state === 'active') refreshEntitlement();
    });
    refreshEntitlement();

    return () => {
      active = false;
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      foregroundSubscription.remove();
      endConnection().catch(error => {
        reportBillingError('disconnect', error);
      });
    };
  }, []);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguageCode).then(() => {});
  }, [selectedLanguageCode]);

  useEffect(() => {
    const onThemeChange = (preferences: AppearancePreferences) => {
      if (appearance === IAppearanceType.Auto) {
        setIsDarkMode(preferences.colorScheme === 'dark');
      }
    };
    const listener = Appearance.addChangeListener(onThemeChange);
    return () => listener.remove();
  }, [appearance, setIsDarkMode]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

export default memo(AppManager);
