import { IAdsActivity } from 'app/components/AdsListItem';
import { NavigatorScreenParams } from '@react-navigation/native';

export interface LoadingParams {}
export interface MoreAppsParams {}
export interface SettingsParams {}
export interface LicenseTypes {}
export interface AboutParams {}
export interface SelectAppearanceParams {}
export interface TranslatorsParams {}
export interface DashboardTab {
  userId: string;
}
export interface PurchaseScreen {
  fromTheme: boolean;
}
export interface AdsDetails {
  item: IAdsActivity;
}

export interface AdsDetails {
  item: IAdsActivity;
}

export interface HomeTabsParams {}

export interface MoreTabParams {}
export interface DashboardTabParams {}

export type LoggedInTabNavigatorParams = {
  Loading: LoadingParams;
  HomeTabs: HomeTabsParams;
  MoreApps: MoreAppsParams;
  Settings: SettingsParams;
  About: AboutParams;
  SelectAppearance: SelectAppearanceParams;
  License: LicenseTypes;
  Translators: TranslatorsParams;
  AdsDetails: AdsDetails;
  Purchase: PurchaseScreen;
};

export type HomeTabsNavigatorParams = {
  DashboardTab: DashboardTabParams;
  MoreTab: MoreTabParams;
};

export type HomeTabNavigatorParams = {
  LoggedInTabNavigator: NavigatorScreenParams<LoggedInTabNavigatorParams>;
};
