import React from 'react';

//ThirdParty

//Redux

//App Modules
import Utils from 'app/utils';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useAppConfigStore from 'app/store/appConfig';
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Loading'>;

const Loading = ({ navigation }: Props) => {
  //Constants
  const purchased = useAppConfigStore(store => store.purchased);
  const setAppearance = useThemeConfigStore(store => store.setAppearance);
  const isDark = useThemeConfigStore(state => state.isDark);

  React.useEffect(() => {
    if (!purchased) {
      setAppearance(IAppearanceType.Light);
    }

    navigation.replace('HomeTabs', {});
    Utils.rateApp.rateAppIfNeeded().then(() => {
      console.log('Rate app opens');
    });
  }, [isDark, navigation, purchased, setAppearance]);

  return null;
};

export default Loading;
