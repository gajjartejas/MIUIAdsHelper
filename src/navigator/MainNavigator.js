import React from 'react';
import {Animated, View} from 'react-native';

//Third Party
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//App Modules
import Components from '../components/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import {navigationRef, navigate} from '../module/RootNavigation';
import strings from '../localization/LocalizedStrings';
import Themes from '../Themes/index';

//Screens
import HomeScreen from '../screen/HomeScreen';
import AboutScreen from '../screen/AboutScreen';
import DetailScreen from '../screen/DetailScreen';
import LicenseScreen from '../screen/LicenseScreen';
import SelectLanguageScreen from '../screen/SelectLanguageScreen';
import SelectThemeScreen from '../screen/SelectThemeScreen';
import RNBootSplash from 'react-native-bootsplash';
import PurchaseScreen from '../screen/PurchaseScreen';
import {connect} from 'react-redux';

const Stack = createStackNavigator();

const forSlide = ({current, next, inverted, layouts: {screen}}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: 'clamp',
            }),
            inverted
          ),
        },
      ],
    },
  };
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
  },
};

class MyStack extends React.Component {
  render() {
    return (
      <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})} theme={MyTheme} ref={navigationRef}>
        <Stack.Navigator
          sceneContainerStyle={{backgroundColor: 'black'}}
          screenOptions={{
            headerTintColor: Themes.getColors().COLOR_WHITE,
            headerStyle: {backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR},
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: strings.navigator_screen_title_home,
              cardStyleInterpolator: forSlide,
              headerRight: () => (
                <View style={{flexDirection: 'row'}}>
                  {!this.props.purchased && (
                    <Components.AppTouchable
                      style={{
                        height: '100%',
                        paddingHorizontal: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 46,
                      }}
                      onPress={() => {
                        navigate('Purchase');
                      }}>
                      <Entypo name={'lock-open'} size={26} color={Themes.getColors().COLOR_WHITE} />
                    </Components.AppTouchable>
                  )}
                  <Components.AppTouchable
                    style={{
                      height: '100%',
                      paddingLeft: 12,
                      paddingRight: 12,
                      marginRight: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 46,
                    }}
                    onPress={() => {
                      navigate('About');
                    }}>
                    <Ionicons name={'ios-settings-sharp'} size={26} color={Themes.getColors().COLOR_WHITE} />
                  </Components.AppTouchable>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{
              title: strings.navigator_screen_title_about,
              cardStyleInterpolator: forSlide,
            }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: strings.navigator_screen_title_detail,
              cardStyleInterpolator: forSlide,
            }}
          />
          <Stack.Screen
            name="SelectLanguage"
            component={SelectLanguageScreen}
            options={{
              title: strings.navigator_screen_title_language,
              cardStyleInterpolator: forSlide,
            }}
          />
          <Stack.Screen
            name="SelectTheme"
            component={SelectThemeScreen}
            options={{
              title: strings.navigator_screen_title_theme,
              cardStyleInterpolator: forSlide,
            }}
          />
          <Stack.Screen
            name="License"
            component={LicenseScreen}
            options={{
              title: strings.navigator_screen_title_license,
              cardStyleInterpolator: forSlide,
            }}
          />
          <Stack.Screen
            name="Purchase"
            component={PurchaseScreen}
            options={{
              title: strings.iap_navigation_title,
              cardStyleInterpolator: forSlide,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  purchased: state.user.purchased,
});

export default connect(mapStateToProps, null)(MyStack);
