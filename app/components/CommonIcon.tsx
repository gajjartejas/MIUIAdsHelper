import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

// Import icon sets
import FontAwesome6, {
  FontAwesome6BrandIconName,
  FontAwesome6IconName,
  FontAwesome6RegularIconName,
  FontAwesome6SolidIconName,
} from '@react-native-vector-icons/fontawesome6';
import MaterialDesignIcons, { MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';

export type IconType = 'fontawesome6' | 'material';

export interface CommonIconProps {
  type: IconType;
  name: FontAwesome6IconName | MaterialDesignIconsIconName | string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  iconStyle?: 'solid' | 'regular' | 'brand';
}

const CommonIcon: React.FC<CommonIconProps> = ({
  type,
  name,
  size,
  color,
  style,
  onPress,
  iconStyle = 'solid',
}) => {
  if (type === 'fontawesome6') {
    if (iconStyle === 'regular') {
      return (
        <FontAwesome6
          iconStyle="regular"
          name={name as FontAwesome6RegularIconName}
          size={size}
          color={color}
          style={style}
          onPress={onPress}
        />
      );
    }
    if (iconStyle === 'brand') {
      return (
        <FontAwesome6
          iconStyle="brand"
          name={name as FontAwesome6BrandIconName}
          size={size}
          color={color}
          style={style}
          onPress={onPress}
        />
      );
    }
    return (
      <FontAwesome6
        iconStyle="solid"
        name={name as FontAwesome6SolidIconName}
        size={size}
        color={color}
        style={style}
        onPress={onPress}
      />
    );
  }

  if (type === 'material') {
    return (
      <MaterialDesignIcons
        name={name as MaterialDesignIconsIconName}
        size={size}
        color={color}
        style={style}
        onPress={onPress}
      />
    );
  }

  return null;
};

export default CommonIcon;
