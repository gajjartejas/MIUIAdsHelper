import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import {Provider} from 'react-redux';
import {store} from './src/store/index';
import MainNavigator from './src/navigator/MainNavigator';
import Components from './src/components/index';

import strings from './src/localization/LocalizedStrings';
import Config from './src/config/index';
import {supportedLanguages} from './src/localization/SupportedLanguages';
import Themes from './src/Themes/index';

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

if (Button.defaultProps == null) Button.defaultProps = {};
Button.defaultProps.allowFontScaling = false;

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
      appTheme = 'auto';
      AsyncStorage.setItem('app_theme', appTheme);
    }
    Themes.configure(appTheme);

    //Language Config
    let languageCode = await AsyncStorage.getItem('app_language');
    if (!languageCode) {
      let locates = RNLocalize.getLocales();
      if (locates && locates.length > 0) {
        let locate = locates[0];
        let languageCode = locate.languageCode;
        let matchedLanguages = supportedLanguages.filter((value) => {
          return value.languageCode == languageCode;
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
  }

  setLanguage(languageCode) {
    AsyncStorage.setItem('app_language', languageCode);
    strings.setLanguage(languageCode);
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) return <View style={{backgroundColor: Themes.getColors().COLOR_BLACK, flex: 1}} />;

    return (
      <Provider store={store}>
        <Components.AppGlobalModule>
          <MainNavigator />
        </Components.AppGlobalModule>
      </Provider>
    );
  }
}

export default App;
