import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

//Third Party
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { getAnalytics, logScreenView } from '@react-native-firebase/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Screens
import LoggedInTabNavigator from 'app/navigation/HomeTabNavigator';

//App Modules
import { HomeTabNavigatorParams } from 'app/navigation/types';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  ExtendedMD3Theme,
  PaperThemeDark,
  PaperThemeDefault,
} from 'app/config/app-theme-config';
import useThemeConfigStore from 'app/store/themeConfig';
import Components from 'app/components';
import { navigationRef } from 'app/navigation/NavigationService';
import { useCallback, useRef, useState } from 'react';

const homeOptions: NativeStackNavigationOptions = {
  title: 'Home',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerShown: false,
};

const RootNavigation: React.FC = () => {
  const routeNameRef = useRef<string | undefined>(undefined);
  const [devScreenName, setDevScreenName] = useState<string>('');
  const insets = useSafeAreaInsets();

  const isDark = useThemeConfigStore(state => state.isDark);
  const primary = useThemeConfigStore(state => state.primary);
  const onPrimary = useThemeConfigStore(state => state.onPrimary);
  const secondaryContainer = useThemeConfigStore(state => state.secondaryContainer);
  const onSecondary = useThemeConfigStore(state => state.onSecondary);
  const Stack = createNativeStackNavigator<HomeTabNavigatorParams>();

  const paperTheme: ExtendedMD3Theme = isDark
    ? {
        ...PaperThemeDark,
        colors: {
          ...PaperThemeDark.colors,
          primary: primary,
          onPrimary: onPrimary,
          secondaryContainer: secondaryContainer,
          onSecondary: onSecondary,
        },
      }
    : {
        ...PaperThemeDefault,
        colors: {
          ...PaperThemeDefault.colors,
          primary: primary,
          onPrimary: onPrimary,
          secondaryContainer: secondaryContainer,
          onSecondary: onSecondary,
        },
      };

  const navTheme: Theme = isDark
    ? {
        ...CombinedDarkTheme,
        colors: {
          ...CombinedDarkTheme.colors,
          primary: primary,
        },
      }
    : {
        ...CombinedDefaultTheme,
        colors: {
          ...CombinedDefaultTheme.colors,
          primary: primary,
        },
      };

  const onReady = useCallback(async () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    const currentRouteName = currentRoute?.name;
    routeNameRef.current = currentRouteName;
    if (__DEV__ && currentRouteName) {
      setDevScreenName(currentRouteName);
    }
  }, []);

  const onStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationRef.current?.getCurrentRoute();
    const currentRouteName = currentRoute?.name;
    const currentRouteParams = currentRoute?.params;

    if (__DEV__ && currentRouteName) {
      setDevScreenName(currentRouteName);
    }

    if (previousRouteName !== currentRouteName && currentRouteName) {
      const sanitizedParams: Record<string, string | number | boolean> = {};
      if (currentRouteParams && typeof currentRouteParams === 'object') {
        for (const [key, value] of Object.entries(currentRouteParams)) {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            sanitizedParams[key] = value;
          }
        }
      }
      logScreenView(getAnalytics(), {
        screen_name: currentRouteName,
        screen_class: currentRouteName,
        ...sanitizedParams,
      });
    }
    routeNameRef.current = currentRouteName;
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer ref={navigationRef} theme={navTheme} onReady={onReady} onStateChange={onStateChange}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} animated={true} />
        {__DEV__ && !!devScreenName && (
          <View pointerEvents="none" style={[styles.devScreenBadge, { top: Math.max(insets.top, 8) + 2 }]}>
            <Text style={styles.devScreenText}>{devScreenName}</Text>
          </View>
        )}
        <Stack.Navigator>
          <Stack.Screen name="LoggedInTabNavigator" component={LoggedInTabNavigator} options={homeOptions} />
        </Stack.Navigator>
        <Components.CommonDialog />
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  devScreenBadge: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 999999,
    elevation: 999999,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  devScreenText: {
    color: '#00FF66',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default RootNavigation;
