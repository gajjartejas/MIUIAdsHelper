//Interfaces
import { IAppearanceType } from 'app/store/themeConfig';
import { IconType } from 'app/components/CommonIcon';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';

export interface ISettingItem {
  id: number;
  iconName: string;
  iconType: IconType;
  title: string;
  description: string;
  route?: keyof LoggedInTabNavigatorParams | string;
  touchable?: boolean;
  value?: unknown;
  inputType?: 'input' | 'switch';
}

export interface ISettingSection {
  id: number;
  title: string;
  items: ISettingItem[];
}

export interface ISettingThemeOptions {
  id: number;
  title: string;
  value: IAppearanceType;
}
