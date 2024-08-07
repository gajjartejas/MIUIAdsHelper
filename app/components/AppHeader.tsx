import React, { memo } from 'react';

//ThirdParty
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//App modules
import { AppTheme } from 'app/models/theme';
import Icon from 'react-native-easy-icon';

interface AppHeaderProps {
  showBackButton?: boolean;
  onPressBackButton?: () => void;
  title?: string | null;
  subTitle?: string | null;
  leftTitle?: string;
  style?: object;
  textStyle?: object | null;
  tintColor?: string | null;
  showNotificationBell?: boolean | null;
  RightViewComponent?: React.ReactElement | null;
  LeftViewComponent?: React.ReactElement | null;
  SubTitleComponent?: React.ReactElement | null;
  statusBarHeight?: number | null;
  backArrowImage?: string;
  largeHeader?: boolean;
}

const AppHeader = (props: AppHeaderProps) => {
  //Ref
  const { colors } = useTheme<AppTheme>();

  //Const
  const insets = useSafeAreaInsets();
  const statusBarHeight = props.statusBarHeight === undefined ? insets.top : props.statusBarHeight;
  const backButtonPaddingForTitle = !props.showBackButton ? { marginLeft: 0 } : { marginLeft: 0, marginRight: 0 };
  const tintColor = props.tintColor === undefined ? colors.onBackground : props.tintColor;
  const textStyle = props.textStyle === undefined ? {} : props.textStyle;
  const LeftViewComponent = props.RightViewComponent === undefined ? <></> : props.LeftViewComponent;
  const backArrowImage = props.backArrowImage === undefined ? 'chevron-left' : props.backArrowImage;
  const RightViewComponent = props.RightViewComponent === undefined ? <></> : props.RightViewComponent;
  const SubTitleComponent = props.SubTitleComponent === undefined ? <></> : props.SubTitleComponent;

  return (
    <View
      style={{
        ...styles.headerContainer,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: colors.background,
        ...props.style,
      }}>
      <View style={[styles.statusBar, { height: statusBarHeight }]} />
      <View style={[styles.navigationContainer, props.largeHeader && styles.largeStatusBarHeight]}>
        <View style={[StyleSheet.absoluteFill, styles.titleViewStyle]}>
          {!!props.title && (
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{ ...styles.titleTextStyle, color: colors.text, ...backButtonPaddingForTitle, ...textStyle }}>
              {props.title}
            </Text>
          )}
          {!!props.subTitle && (
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ ...styles.subTitleTextStyle, color: colors.text }}>
              {props.subTitle}
            </Text>
          )}
          {SubTitleComponent}
        </View>
        {LeftViewComponent}
        {props.showBackButton && (
          <TouchableOpacity activeOpacity={0.8} style={styles.menuButton} onPress={props.onPressBackButton!}>
            <Icon type="entypo" name={backArrowImage} color={tintColor!} size={26} />
          </TouchableOpacity>
        )}

        <View style={styles.leftTitleViewStyle}>
          <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ ...styles.titleTextStyle, ...textStyle }}>
            {props.leftTitle}
          </Text>
        </View>

        {RightViewComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  statusBar: {
    width: '100%',
  },
  navigationContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 44, //no need to normalize
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  drawerImage: {
    width: 18,
    height: 18,
  },
  titleTextStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
  subTitleTextStyle: {
    fontSize: 12,
    fontWeight: '400',
  },
  titleViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginHorizontal: 44,
    zIndex: 1,
  },
  leftTitleViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'flex-start',
    marginLeft: 13,
  },
  largeStatusBarHeight: {
    height: 52,
  },
});

export default memo(AppHeader);
