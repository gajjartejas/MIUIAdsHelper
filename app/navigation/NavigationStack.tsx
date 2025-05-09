import React from 'react';
import { StatusBar } from 'react-native';

//Third Party
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

//Screens
import LoggedInTabNavigator from 'app/navigation/HomeTabNavigator';

//App Modules
import { HomeTabNavigatorParams } from 'app/navigation/types';
import { PaperThemeDark, PaperThemeDefault } from 'app/config/app-theme-config';
import useThemeConfigStore from 'app/store/themeConfig';
import { navigationRef } from 'app/navigation/NavigationService';

const homeOptions: Object = {
  title: 'Home',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerShown: false,
};

const RootNavigation: React.FC = () => {
  const isDark = useThemeConfigStore(state => state.isDark);
  const primary = useThemeConfigStore(state => state.primary);
  const onPrimary = useThemeConfigStore(state => state.onPrimary);
  const secondaryContainer = useThemeConfigStore(state => state.secondaryContainer);
  const onSecondary = useThemeConfigStore(state => state.onSecondary);
  const Stack = createNativeStackNavigator<HomeTabNavigatorParams>();
  const theme = isDark
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

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef} theme={theme}>
        <StatusBar
          backgroundColor={'#FFFFFF00'}
          barStyle={isDark ? 'light-content' : 'dark-content'}
          translucent={true}
        />
        <Stack.Navigator>
          <Stack.Screen name="LoggedInTabNavigator" component={LoggedInTabNavigator} options={homeOptions} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default RootNavigation;
