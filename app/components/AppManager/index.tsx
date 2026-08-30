import React, { memo, ReactElement, useEffect } from 'react';
import { Appearance, View } from 'react-native';

//App Modules
import styles from './styles';
import AppearancePreferences = Appearance.AppearancePreferences;
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';
import i18n from 'app/locales';
import useAppLangConfigStore from 'app/store/appLangConfig';
import {
  endConnection,
  ErrorCode,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  Purchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import useAppConfigStore from 'app/store/appConfig';
import NavigationService from 'app/navigation/NavigationService';
import { useTranslation } from 'react-i18next';
import crashlytics from 'app/services/crashlytics';
import analytics from 'app/services/analytics';
import { showAppDialog } from 'app/store/dialogStore';

//Interface
export type Props = {
  children: ReactElement[] | ReactElement;
};

const AppManager = ({ children }: Props) => {
  const setIsDarkMode = useThemeConfigStore(store => store.setIsDarkMode);
  const appearance = useThemeConfigStore(store => store.appearance);
  const setPurchased = useAppConfigStore(state => state.setPurchased);
  const selectedLanguageCode = useAppLangConfigStore(store => store.selectedLanguageCode);
  const { t } = useTranslation();

  useEffect(() => {
    let purchaseUpdateSubscription: { remove: () => void } | undefined;
    let purchaseErrorSubscription: { remove: () => void } | undefined;

    const setupIAP = async () => {
      try {
        await initConnection();

        const purchases = await getAvailablePurchases();
        if (purchases && purchases.length > 0) {
          for (const purchase of purchases) {
            if ('isAcknowledgedAndroid' in purchase && !purchase.isAcknowledgedAndroid) {
              try {
                await finishTransaction({ purchase, isConsumable: false });
              } catch (ackError) {
                console.warn('AppManager->ackError:', ackError);
              }
            }
          }
          setPurchased(__DEV__ ? false : true);
        }
      } catch (e: unknown) {
        console.error('AppManager->setupIAP->error:', e);
        crashlytics().recordError(e, 'AppManager->setupIAP->error');
      }

      purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
        console.log('AppManager->purchaseUpdatedListener->purchase:', purchase);
        if (purchase) {
          try {
            await finishTransaction({ purchase, isConsumable: false });
            setPurchased(true);
            analytics().logEvent('iap_purchase_success', {
              productId: purchase.productId,
              transactionId: purchase.transactionId ?? '',
            });
            showAppDialog(
              '',
              t('iap_purchased_success'),
              [
                {
                  text: 'OKAY',
                  onPress: () => {
                    NavigationService.goBack();
                  },
                },
              ],
              {
                onDismiss: () => {
                  NavigationService.goBack();
                },
              },
            );
          } catch (e: unknown) {
            console.error('AppManager->purchaseUpdatedListener->error:', e);
            const message = e instanceof Error ? e.message : String(e);
            showAppDialog(message);
            crashlytics().recordError(e, 'AppManager->purchaseUpdatedListener->error');
          }
        }
      });

      purchaseErrorSubscription = purchaseErrorListener(e => {
        console.log('AppManager->purchaseErrorListener:', e);
        if (e.code === ErrorCode.UserCancelled) {
          return;
        }
        const message = e.message || 'Purchase error';
        showAppDialog(message);
        crashlytics().recordError(e, 'AppManager->purchaseErrorListener');
      });
    };

    setupIAP();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      endConnection().catch(e => {
        console.log('AppManager->endConnection->error:', e);
      });
    };
  }, [setPurchased, t]);

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
