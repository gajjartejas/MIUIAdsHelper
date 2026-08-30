import * as React from 'react';
import { NavigationContainerRefWithCurrent, NavigationState } from '@react-navigation/native';
import { HomeTabNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';

export const navigationRef = React.createRef<NavigationContainerRefWithCurrent<HomeTabNavigatorParams>>();

function navigate<RouteName extends keyof LoggedInTabNavigatorParams>(
  name: RouteName,
  params?: LoggedInTabNavigatorParams[RouteName],
) {
  if (navigationRef.current?.isReady()) {
    // Navigate via the LoggedInTabNavigator stack
    (navigationRef.current as any).navigate('LoggedInTabNavigator', {
      screen: name,
      params,
    });
  }
}

function goBack() {
  if (navigationRef.current?.isReady() && navigationRef.current?.canGoBack()) {
    navigationRef.current.goBack();
  }
}

function reset(params: NavigationState) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.reset(params);
  }
}

export default {
  navigate,
  goBack,
  reset,
};
