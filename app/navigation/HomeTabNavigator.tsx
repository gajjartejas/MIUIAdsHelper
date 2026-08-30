import React from 'react';

//Third Party
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Screens
import Loading from 'app/screens/Loading';
import ChangeLanguage from 'app/screens/Settings/ChangeLanguage';
import DashboardTab from 'app/screens/Home/DashboardTab';
import MoreTab from 'app/screens/Home/MoreTab';
import MoreApps from 'app/screens/Settings/MoreApps';
import Settings from 'app/screens/Settings/Settings';
import About from 'app/screens/Settings/About';
import SelectAppearance from 'app/screens/Settings/SelectAppearance';
import License from 'app/screens/Settings/License';
import Translators from 'app/screens/Settings/Translators';
import AdsDetail from 'app/screens/Home/AdsDetail';
import Purchase from 'app/screens/Home/Purchase';

//App Modules
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import CommonIcon from 'app/components/CommonIcon';


const Tab = createBottomTabNavigator<HomeTabsNavigatorParams>();

function HomeTabs() {
  //Constants
  const { colors } = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: insets.bottom + 44,
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <CommonIcon
              type="material"
              name="view-dashboard"
              size={22}
              color={focused ? colors.primary : colors.onSurfaceVariant}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreTab}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <CommonIcon
              type="fontawesome6"
              name="ellipsis"
              size={20}
              color={focused ? colors.primary : colors.onSurfaceVariant}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const LoggedInStack = createNativeStackNavigator<LoggedInTabNavigatorParams>();

const LoggedInTabNavigator = () => {
  return (
    <LoggedInStack.Navigator>
      <LoggedInStack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="MoreApps" component={MoreApps} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="About" component={About} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="SelectAppearance" component={SelectAppearance} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="License" component={License} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="Translators" component={Translators} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="AdsDetails" component={AdsDetail} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="Purchase" component={Purchase} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="ChangeLanguage" component={ChangeLanguage} options={{ headerShown: false }} />
    </LoggedInStack.Navigator>
  );
};

export default LoggedInTabNavigator;
