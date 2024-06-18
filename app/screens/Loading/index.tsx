import React from 'react';

//ThirdParty

//Redux

//App Modules
import Utils from 'app/utils';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Loading'>;

const Loading = ({ navigation }: Props) => {
  //Constants

  React.useEffect(() => {
    navigation.replace('HomeTabs', {});
    Utils.rateApp.rateAppIfNeeded().then(() => {
      console.log('Rate app opens');
    });
  }, [navigation]);

  return null;
};

export default Loading;
