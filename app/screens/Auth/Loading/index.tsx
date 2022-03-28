import React, { useState } from 'react';

//ThirdParty
import RNBootSplash, { Config } from 'react-native-bootsplash';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import * as themeActions from 'app/store/actions/themeActions';
import IState from 'app/models/models/appState';

//App Modules
import Navigator from 'app/navigation';
import Utils from 'app/utils';
import { IAppearanceType } from 'app/models/reducers/theme';

const Loading: React.FC = () => {
  //Constants
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const purchased = useSelector((state: IState) => state.appConfigReducer.purchased);

  React.useEffect(() => {
    if (!purchased) {
      dispatch(themeActions.setAppearance(IAppearanceType.Light));
    }

    RNBootSplash.hide({ duration: 250 } as Config).then(() => {
      setLoading(false);
      Utils.rateApp.rateAppIfNeeded().then(() => {
        console.log('Rate app opens');
      });
    });
  }, [dispatch, purchased]);

  return loading ? null : <Navigator />;
};

export default Loading;
