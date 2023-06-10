import React from 'react';

//ThirdParty
import RNBootSplash, { Config } from 'react-native-bootsplash';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import * as themeActions from 'app/store/actions/themeActions';
import IState from 'app/models/models/appState';

//App Modules
import Utils from 'app/utils';
import { IAppearanceType } from 'app/models/reducers/theme';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Loading'>;

const Loading = ({ navigation }: Props) => {
  //Constants
  const dispatch = useDispatch();
  const purchased = useSelector((state: IState) => state.appConfigReducer.purchased);

  React.useEffect(() => {
    if (!purchased) {
      dispatch(themeActions.setAppearance(IAppearanceType.Light));
    }
    navigation.replace('HomeTabs', {});

    RNBootSplash.hide({ duration: 200, fade: true } as Config).then(() => {
      Utils.rateApp.rateAppIfNeeded().then(() => {
        console.log('Rate app opens');
      });
    });
  }, [dispatch, navigation, purchased]);

  return null;
};

export default Loading;
