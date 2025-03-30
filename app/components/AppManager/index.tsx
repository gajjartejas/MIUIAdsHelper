import React, { memo, ReactElement, useEffect } from 'react';
import { Alert, Appearance, EmitterSubscription, View } from 'react-native';

//App Modules
import styles from './styles';
import AppearancePreferences = Appearance.AppearancePreferences;
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';
import i18n from 'app/locales';
import useAppLangConfigStore from 'app/store/appLangConfig';
import {
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  initConnection,
  ProductPurchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import useAppConfigStore from 'app/store/appConfig';
import { navigationRef } from 'app/navigation/NavigationService';
import { useTranslation } from 'react-i18next';
import crashlytics from '@react-native-firebase/crashlytics';

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

  //States

  useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription;
    let purchaseErrorSubscription: EmitterSubscription;

    (async () => {
      await initConnection();
      await flushFailedPurchasesCachedAsPendingAndroid();

      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        setPurchased(__DEV__ ? false : true);
      }

      purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: ProductPurchase) => {
        const receipt = purchase.transactionReceipt;
        console.log('AppManager->useEffect->purchaseUpdatedListener->receipt', receipt);
        if (receipt) {
          try {
            const ackResult = await finishTransaction({ purchase, isConsumable: false });
            console.log('AppManager->useEffect->purchaseUpdatedListener->ackResult', ackResult);
            setPurchased(true);
            Alert.alert(t('iap_purchased_success'));
            navigationRef.current?.goBack();
          } catch (e: any) {
            console.error('AppManager->useEffect->purchaseUpdatedListener->error:', e);
            Alert.alert(e.message);
            crashlytics().recordError(e, 'AppManager->useEffect->purchaseUpdatedListener->error');
          }
        } else {
          console.warn('AppManager->useEffect->purchaseUpdatedListener->receipt->not found');
        }
      });

      purchaseErrorSubscription = purchaseErrorListener(e => {
        console.log('purchaseErrorListener', e);
        Alert.alert(e.message);
        crashlytics().recordError(e, 'AppManager->useEffect->purchaseErrorListener');
      });
    })();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
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
