import React, {Component} from 'react';
import {ScrollView, StyleSheet, Image, Text, View, TouchableOpacity, Linking} from 'react-native';

//Third Party
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import DeviceInfo from 'react-native-device-info';

//App Modules
import strings from '../localization/LocalizedStrings';
import Config from '../config/index';
import Themes from '../Themes/index';
import {connect} from 'react-redux';

const BottomLine = () => <View style={styles().bottomLine} />;

const MIButton = (props) => (
  <TouchableOpacity
    style={styles().miButtonTouchable}
    onPress={() => {
      props.onPress();
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{width: 30, alignItems: 'center', justifyContent: 'center', marginLeft: 16}}>{props.icon}</View>
      <Text style={styles().miButtonText}>{props.title}</Text>
    </View>
  </TouchableOpacity>
);

class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
    this.navigate = this.props.navigation;
  }

  iconFrom = (name, family) => {
    switch (family) {
      case 'FontAwesome':
        return <FontAwesome name={name} size={26} color={`${Themes.getColors().COLOR_WHITE}80`} />;
      case 'MaterialIcons':
        return <MaterialIcons name={name} size={26} color={`${Themes.getColors().COLOR_WHITE}80`} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} size={26} color={`${Themes.getColors().COLOR_WHITE}80`} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={name} size={26} color={`${Themes.getColors().COLOR_WHITE}80`} />;
      case 'Ionicons':
        return <Ionicons name={name} size={26} color={`${Themes.getColors().COLOR_WHITE}80`} />;
      case 'FontAwesome5Pro':
        return <FontAwesome5Pro name={name} size={26} color={`${Themes.getColors().COLOR_WHITE}80`} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <View style={styles().container}>
        <ScrollView style={styles().scrollview}>
          <View style={styles().scrollContainerBiew}>
            <Image source={require('../assets/images/appicon.png')} resizeMode="contain" style={styles().appicon} />
            <Text style={styles().appNameText}>{DeviceInfo.getApplicationName()}</Text>
            <Text style={styles().appVersionText}>v{DeviceInfo.getVersion()}</Text>
          </View>
          <View style={styles().buttonsContainerView}>
            <MIButton
              onPress={() => {
                this.props.navigation.navigate('SelectLanguage');
              }}
              title={strings.about_change_language}
              icon={this.iconFrom('language', 'FontAwesome')}
            />
            <BottomLine />

            <MIButton
              onPress={() => {
                if (this.props.purchased) {
                  this.props.navigation.navigate('SelectTheme');
                } else {
                  this.props.navigation.navigate('Purchase', {fromTheme: true});
                }
              }}
              title={strings.navigator_screen_title_theme}
              icon={this.iconFrom('md-color-palette', 'Ionicons')}
            />
            <BottomLine />

            <MIButton
              onPress={() => {
                Linking.openURL(Config.Constant.APP_URL);
              }}
              title={strings.about_rate_playstore}
              icon={this.iconFrom('star', 'FontAwesome')}
            />
            <BottomLine />

            <MIButton
              onPress={() => {
                Linking.openURL(Config.Constant.TOS_URL);
              }}
              title={strings.about_terms_service}
              icon={this.iconFrom('legal', 'FontAwesome')}
            />
            <BottomLine />

            <MIButton
              onPress={() => {
                Linking.openURL(Config.Constant.PP_URL);
              }}
              title={strings.about_privacy_policy}
              icon={this.iconFrom('lock', 'FontAwesome')}
            />
            <BottomLine />

            <MIButton
              onPress={() => {
                this.navigate.navigate('License');
              }}
              title={strings.about_credits}
              icon={this.iconFrom('github-alt', 'FontAwesome')}
            />
          </View>
          <BottomLine />

          <MIButton
            onPress={() => {
              Linking.openURL(Config.Constant.REPO_URL);
            }}
            title={strings.about_github}
            icon={this.iconFrom('github', 'FontAwesome')}
          />
          <BottomLine />

          <View style={styles().copyrightContainerView}>
            <Text style={styles().copyrightNameText}>{strings.about_copy_right_name}</Text>
            <Text style={styles().copyrightVersionText}>{strings.about_copy_right}</Text>
            <Text style={styles().translatorText}>{strings.about_russian_translation}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    bottomLine: {
      height: 0.5,
      backgroundColor: 'lightgray',
      marginLeft: 12,
      marginRight: 12,
    },
    miButtonTouchable: {
      height: 50,
      justifyContent: 'center',
    },
    miButtonText: {
      fontSize: 16,
      color: Themes.getColors().COLOR_WHITE,
      marginLeft: 20,
    },
    scrollview: {
      flex: 1,
    },
    scrollContainerBiew: {
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    appicon: {
      width: 50,
      height: 50,
      borderRadius: 20,
      marginTop: 16,
    },
    appNameText: {
      marginTop: 20,
      fontSize: 18,
      color: Themes.getColors().COLOR_WHITE,
    },
    appVersionText: {
      marginTop: 20,
      fontSize: 18,
      color: Themes.getColors().COLOR_WHITE,
    },
    buttonsContainerView: {
      flex: 1,
    },
    copyrightContainerView: {
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    copyrightNameText: {
      fontSize: 14,
      color: Themes.getColors().COLOR_WHITE + 'bb',
    },
    copyrightVersionText: {
      fontSize: 14,
      color: Themes.getColors().COLOR_WHITE + 'bb',
      marginTop: 4,
    },
    translatorText: {
      fontSize: 14,
      color: Themes.getColors().COLOR_WHITE + 'bb',
      marginTop: 20,
      alignSelf: 'center',
      textAlign: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
    },
  });

const mapStateToProps = (state) => ({
  purchased: state.user.purchased,
});

export default connect(mapStateToProps, null)(AboutScreen);
