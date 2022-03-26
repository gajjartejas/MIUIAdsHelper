import React, { useState } from 'react';

//ThirdParty
import RNBootSplash, { Config } from 'react-native-bootsplash';

//Redux
import { useDispatch } from 'react-redux';

//App Modules
import Navigator from 'app/navigation';
import Utils from 'app/utils';

const Loading: React.FC = () => {
  //Constants
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    RNBootSplash.hide({ duration: 250 } as Config).then(() => {
      setLoading(false);

      Utils.rateApp.rateAppIfNeeded().then(() => {
        console.log('Rate app opens');
      });
    });
  }, [dispatch]);

  return loading ? null : <Navigator />;
};

export default Loading;
