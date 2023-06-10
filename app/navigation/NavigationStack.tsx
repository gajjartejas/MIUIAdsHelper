import * as React from 'react';
import { StatusBar } from 'react-native';

//Third Party
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

import { useSelector } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

//Screens
import LoggedInTabNavigator from 'app/navigation/HomeTabNavigator';

//Redux
import IState from 'app/models/models/appState';

//App Modules
import { HomeTabNavigatorParams } from 'app/navigation/types';

const homeOptions: Object = {
  title: 'Home',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerShown: false,
};

const RootNavigation = () => {
  const primary = useSelector((state: IState) => state.themeReducer.primary);
  const routeNameRef = React.useRef<string | null>();
  const navigationRef = React.useRef<any>();

  const isDark = useSelector((state: IState) => state.themeReducer.isDark);
  const Stack = createNativeStackNavigator<HomeTabNavigatorParams>();

  const PaperThemeDefault = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
      primary: primary,
      onPrimary: '#FFFFFF',

      secondaryContainer: primary,
      onSecondary: '#FFFFFF',

      background: '#FFFFFF',
      onBackground: '#000000',

      surface: '#eeeeee',
      onSurface: '#000000',

      error: '#FF0000',

      card: '#FFFFFF',
      opacity: '80',

      white: '#ffffff',
      black: '#000000',

      textTitle: '#535b6b',

      text: '#535b6b',
    },
  };

  const PaperThemeDark = {
    ...MD3DarkTheme,
    ...DarkTheme,
    dark: true,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,

      primary: primary,
      onPrimary: '#000000',

      secondaryContainer: primary,
      onSecondary: '#000000',

      background: '#000000',
      onBackground: '#FFFFFF',

      surface: '#222222',
      onSurface: '#FFFFFF',

      error: '#FF0000',

      card: '#1E1E1E',
      opacity: '99',

      white: '#ffffff',
      black: '#000000',

      textTitle: '#FFFFFF',
      text: '#FFFFFF',
    },
  };

  return (
    <PaperProvider theme={isDark ? PaperThemeDark : PaperThemeDefault}>
      <NavigationContainer
        theme={isDark ? PaperThemeDark : PaperThemeDefault}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current!.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          let currentRoute = navigationRef.current.getCurrentRoute();
          let currentRouteName = currentRoute.name;
          let currentScreenName = currentRoute.name;
          if (currentRouteName === 'AdsDetail') {
            currentScreenName = currentRoute.params.item.appname;
          }
          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentScreenName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
        <StatusBar
          backgroundColor={isDark ? '#000000' : '#00000000'}
          barStyle={isDark ? 'light-content' : 'dark-content'}
          translucent={false}
        />
        <Stack.Navigator>
          <Stack.Screen name="LoggedInTabNavigator" component={LoggedInTabNavigator} options={homeOptions} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default RootNavigation;
