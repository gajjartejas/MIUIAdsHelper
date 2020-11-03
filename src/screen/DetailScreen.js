import React, {Component} from 'react';

import {
  Button,
  ScrollView,
  Dimensions,
  StatusBar,
  Navigator,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Platform,
  WebView,
  ActivityIndicator,
  Linking,
  NativeModules,
} from 'react-native';

import strings from '../localization/LocalizedStrings';

import Components from '../components/index';
import Config from '../config/index';
import Themes from '../Themes/index';

class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openActivity = (packageName, activityName) => {
    return new Promise((resolve, reject) => {
      NativeModules.OpenSettings.openNetworkSettings(packageName, activityName, (data) => {
        if (data != true) {
          resolve(data);
        } else {
          resolve(true);
        }
      });
    });
  };

  openActivities = async (adsSettingPaths) => {
    let results = [];
    for (let i = 0; i < adsSettingPaths.length; i++) {
      const adsSetting = adsSettingPaths[i];
      const result = await this.openActivity(adsSetting.package, adsSetting.activity);
      results.push(result);
    }
    const isActivityExists = results.filter((value) => {
      return value === true;
    });
    if (isActivityExists.length < 1) {
      alert(strings.ads_detail_app_not_available);
    }
  };

  render() {
    const item = this.props.route.params.item; 
    return (
      <View style={styles().container}>
        <Components.ParallaxBackground maxHeight={200} uri={item.illustration}>
          <View style={styles().parallexContainerView}>
            <Text style={styles().adsDetailDescText}>{strings.ads_detail_desc}</Text>
            <Text style={styles().detailText}>{item.detail}</Text>
            <Text style={styles().stepsText}>{strings.ads_detail_steps}</Text>
            <Text style={styles().stepsDescText}>{item.steps}</Text>
            {item.id > 0 && item.adsSettingPaths && !item.hideButton && (
              <TouchableOpacity
                onPress={() => {
                  this.openActivities(item.adsSettingPaths);
                }}
                style={styles().openSettingsButton}>
                <Text style={styles().openSettingsButtonText}>{`${strings.ads_detail_open} ${item.appname} ${strings.ads_detail_settings}`}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles().specialNoteText}>{item.specialNote}</Text>
          </View>
        </Components.ParallaxBackground>
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
    },
    parallexContainerView: {
      flex: 1,
      marginTop: 20,
      width: '100%',
    },
    adsDetailDescText: {
      marginHorizontal: 20,
      fontSize: 30,
      marginTop: 20,
      fontWeight: 'bold',
      color: Themes.getColors().COLOR_WHITE,
    },
    detailText: {
      marginHorizontal: 20,
      fontSize: 18,
      fontWeight: '400',
      marginTop: 4,
      color: Themes.getColors().COLOR_WHITE,
    },
    stepsText: {
      marginHorizontal: 20,
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 20,
      color: Themes.getColors().COLOR_WHITE,
    },
    stepsDescText: {
      marginHorizontal: 20,
      fontSize: 18,
      fontWeight: '400',
      marginTop: 4,
      color: Themes.getColors().COLOR_WHITE,
    },
    openSettingsButton: {
      fontSize: 20,
      borderWidth: 1,
      borderColor: Themes.getColors().COLOR_WHITE,
      margin: 10,
      borderRadius: 8,
      alignSelf: 'center',
      marginTop: 20,
    },
    openSettingsButtonText: {
      fontSize: 18,
      fontWeight: '500',
      margin: 10,
      color: Themes.getColors().COLOR_WHITE,
    },
    specialNoteText: {
      fontSize: 14,
      fontWeight: '400',
      margin: 10,
      color: Themes.getColors().COLOR_RED,
      alignSelf: 'center',
    },
  });

export default DetailScreen;
