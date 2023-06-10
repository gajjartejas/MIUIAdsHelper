import React from 'react';

//Third Party
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-easy-icon';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

//Screens
import DashboardTab from 'app/screens/Home/HomeTabs/DashboardTab';
import MoreTab from 'app/screens/Home/HomeTabs/MoreTab';
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
import Loading from 'app/screens/Auth/Loading';
import { AppTheme } from 'app/models/theme';

const Tab = createMaterialBottomTabNavigator<HomeTabsNavigatorParams>();

function HomeTabs() {
  //Constants
  const { colors } = useTheme<AppTheme>();

  return (
    <Tab.Navigator
      inactiveColor={colors.secondaryContainer}
      activeColor={colors.secondaryContainer}
      barStyle={{ backgroundColor: colors.background }}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardTab}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material-community"
              name="view-dashboard"
              color={focused ? colors.white : colors.primary}
              size={21}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreTab}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material-community"
              name="dots-horizontal"
              color={focused ? colors.white : colors.primary}
              size={21}
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
    </LoggedInStack.Navigator>
  );
};

export default LoggedInTabNavigator;
