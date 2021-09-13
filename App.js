import React from 'react';
import {Appearance, View} from 'react-native';

//Third Party
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';

//App Modules
import MainNavigator from './src/navigator/MainNavigator';
import Components from './src/components/index';
import strings from './src/localization/LocalizedStrings';
import {supportedLanguages} from './src/localization/SupportedLanguages';
import Themes from './src/Themes/index';
import Utils from './src/utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    //Theme Config

    let appTheme = await AsyncStorage.getItem('app_theme');
    if (!appTheme) {
      appTheme = 'light';
      AsyncStorage.setItem('app_theme', appTheme);
    }
    Themes.configure(appTheme);

    //Language Config
    let languageCode = await AsyncStorage.getItem('app_language');
    if (!languageCode) {
      let locates = RNLocalize.getLocales();
      if (locates && locates.length > 0) {
        let locate = locates[0];
        languageCode = locate.languageCode;
        let matchedLanguages = supportedLanguages.filter((value) => {
          return value.languageCode === languageCode;
        });
        if (matchedLanguages && matchedLanguages.length > 0) {
          let matchedLanguage = matchedLanguages[0];
          this.setLanguage(matchedLanguage.languageCode);
        } else {
          this.setLanguage('en');
        }
        this.setLanguage(languageCode);
      } else {
        this.setLanguage('en');
      }
    } else {
      this.setLanguage(languageCode);
    }

    Utils.RateApp.rateAppIfNeeded().then(() => {
      console.log('Rate app opens');
    });
  }

  setLanguage(languageCode) {
    AsyncStorage.setItem('app_language', languageCode);
    strings.setLanguage(languageCode);
    this.setState({loading: false});
  }

  render() {
    const colorScheme = Appearance.getColorScheme();

    if (this.state.loading) {
      return <View style={{flex: 1, backgroundColor: colorScheme === 'dark' ? 'black' : 'white'}} />;
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Components.AppGlobalModule>
            <View style={{flex: 1, backgroundColor: colorScheme === 'dark' ? 'black' : 'white'}}>
              <MainNavigator />
            </View>
          </Components.AppGlobalModule>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
