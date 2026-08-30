import { MD3Theme } from 'react-native-paper';

export type AppColors = MD3Theme['colors'] & {
  textTitle: string;
  card: string;
  opacity: string;
  white: string;
  black: string;
  text: string;
  border?: string;
  notification?: string;
};

export type AppTheme = MD3Theme & {
  colors: AppColors;
};
