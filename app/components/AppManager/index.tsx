import React, { memo, ReactElement, useEffect } from 'react';
import { Appearance, View } from 'react-native';

//App Modules
import styles from './styles';
import AppearancePreferences = Appearance.AppearancePreferences;
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';
import i18n from 'app/locales';
import useAppLangConfigStore from 'app/store/appLangConfig';
import useAppConfigStore from 'app/store/appConfig';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

//Interface
export type Props = {
  children: ReactElement[] | ReactElement;
};

const AppManager = ({ children }: Props) => {
  const setIsDarkMode = useThemeConfigStore(store => store.setIsDarkMode);
  const appearance = useThemeConfigStore(store => store.appearance);
  const setPurchased = useAppConfigStore(state => state.setPurchased);
  const selectedLanguageCode = useAppLangConfigStore(store => store.selectedLanguageCode);

  //States
  useEffect(() => {
    (async () => {
      await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.ERROR);
      Purchases.configure({ apiKey: '' });
      const purchases = await Purchases.restorePurchases();
      if (purchases && purchases.allPurchasedProductIdentifiers.length > 0) {
        setPurchased(!__DEV__);
      }
    })();
  }, [setPurchased]);

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
