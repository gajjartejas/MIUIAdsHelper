import React, {Component} from 'react';
import {Image, Animated, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screen/HomeScreen';
import AboutScreen from '../screen/AboutScreen';
import DetailScreen from '../screen/DetailScreen';
import LicenseScreen from '../screen/LicenseScreen';
import SelectLanguageScreen from '../screen/SelectLanguageScreen';
import SelectThemeScreen from '../screen/SelectThemeScreen';

import Config from '../config/index';
import Components from '../components/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {navigationRef, navigate} from '../module/RootNavigation';
import strings from '../localization/LocalizedStrings';
import Themes from '../Themes/index';

const Stack = createStackNavigator();

const forSlide = ({current, next, inverted, layouts: {screen}}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'extend',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'extend',
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
              outputRange: [screen.width, 0, screen.width * -0.3],
              extrapolateLeft: 'extend',
              extrapolateRight: 'clamp',
            }),
            inverted
          ),
        },
      ],
    },
  };
};

function MyStack() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
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
              <Components.AppTouchable
                style={{flex: 1, height: '100%', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 46}}
                onPress={() => {
                  navigate('About');
                }}>
                <Ionicons name={'ios-settings-sharp'} size={26} color={Themes.getColors().COLOR_WHITE} />
              </Components.AppTouchable>
            ),
            cardStyleInterpolator: forSlide,
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
