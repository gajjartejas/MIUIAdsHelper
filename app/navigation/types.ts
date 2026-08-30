import { IAdsActivity } from 'app/components/AdsListItem';
import { NavigatorScreenParams } from '@react-navigation/native';

export type LoadingParams = undefined | Record<string, never>;
export type MoreAppsParams = undefined | Record<string, never>;
export type SettingsParams = undefined | Record<string, never>;
export type LicenseTypes = undefined | Record<string, never>;
export type AboutParams = undefined | Record<string, never>;
export type SelectAppearanceParams = undefined | Record<string, never>;
export type TranslatorsParams = undefined | Record<string, never>;
export type ChangeLanguageParams = undefined | Record<string, never>;

export interface PurchaseScreen {
  fromTheme: boolean;
}
export interface AdsDetails {
  item: IAdsActivity;
}

export type HomeTabsNavigatorParams = {
  DashboardTab?: undefined | Record<string, never>;
  MoreTab?: undefined | Record<string, never>;
};

export type LoggedInTabNavigatorParams = {
  Loading?: LoadingParams;
  HomeTabs?: NavigatorScreenParams<HomeTabsNavigatorParams>;
  MoreApps?: MoreAppsParams;
  Settings?: SettingsParams;
  About?: AboutParams;
  SelectAppearance?: SelectAppearanceParams;
  License?: LicenseTypes;
  Translators?: TranslatorsParams;
  AdsDetails: AdsDetails;
  Purchase: PurchaseScreen;
  ChangeLanguage?: ChangeLanguageParams;
};

export type HomeTabNavigatorParams = {
  LoggedInTabNavigator?: NavigatorScreenParams<LoggedInTabNavigatorParams>;
};
