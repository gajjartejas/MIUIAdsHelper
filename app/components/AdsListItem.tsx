import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';

//Third Party
import { TouchableRipple, useTheme, Text } from 'react-native-paper';
import Icon from 'react-native-easy-icon';
import { IconType } from 'react-native-easy-icon/src/Icon';
import { useSelector } from 'react-redux';
import IState from 'app/models/models/appState';

//Constants
const { width } = Dimensions.get('window');

//Interface
export interface IAdsActivity {
  id: number;
  appname: string;
  title: string;
  subtitle: string;
  detail: string;
  steps: string;
  specialNote: string;
  adsSettingPaths: IAdsSettingPath[];
  iconBackgroundColor: string;
  iconName: string;
  iconFamily: IconType;
  hideButton: boolean;
  appType: IAdsSettingAppType;
}

export interface IAdsSettingPath {
  package: string | null;
  activity: string | null;
}

export enum IAdsSettingAppType {
  Standard = 'app_type_standard',
  System = 'app_type_system',
  Other = 'app_type_other',
}

export interface IAdsActivitySection {
  title: string;
  data: IAdsActivity[];
}

//Interface
interface IAdsListItem {
  item: IAdsActivity;
  index: number;
  sectionIndex: number;
  onPress: (item: IAdsActivity, index: number, sectionIndex: number) => void;
}

const AdsListItem = (props: IAdsListItem) => {
  //Consts
  const { colors } = useTheme();
  const { item, index } = props;
  const sectionIndex = props.sectionIndex;

  return (
    <View
      style={[styles.container, { backgroundColor: `${colors.background}`, shadowColor: `${colors.onBackground}11` }]}>
      <TouchableRipple
        rippleColor={`${colors.primary}20`}
        style={[styles.touchableButton, { backgroundColor: `${colors.onBackground}20` }]}
        onPress={() => props.onPress(item, index, sectionIndex)}>
        <>
          <Icon type={item.iconFamily} name={item.iconName} color={item.iconBackgroundColor} size={24} />
          <Text numberOfLines={1} style={[styles.titleText, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={[styles.subtitleText, { color: `${colors.text}60` }]}>
            {item.subtitle}
          </Text>
        </>
      </TouchableRipple>
      <TouchableRipple
        rippleColor={`${colors.primary}20`}
        onPress={() => props.onPress(item, index, sectionIndex)}
        style={[styles.disabledButton, { backgroundColor: `${colors.background}cc` }]}>
        <Icon type={'font-awesome5'} name={'lock'} color={`${colors.onBackground}dd`} size={24} />
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: width / 2 - 24,
    borderRadius: 18,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 8,
    shadowOpacity: 1.0,
    marginBottom: 16,
  },
  touchableButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainerView: {
    backgroundColor: 'red',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  disabledButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdsListItem;
