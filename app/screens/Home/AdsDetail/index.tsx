import React from 'react';
import { Text, View, NativeModules, ScrollView, Dimensions, StatusBar } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';

//App Modules
import styles from './styles';
import { IAdsActivity, IAdsSettingPath } from 'app/components/AdsListItem';

//Params
type RootStackParamList = {
  AdsDetails: { item: IAdsActivity };
};
type Props = NativeStackScreenProps<RootStackParamList, 'AdsDetails'>;

const AdsDetails = ({ route, navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const item = route.params.item;

  const openActivity = (packageName: string | null, activityName: string | null) => {
    return new Promise((resolve, _reject) => {
      NativeModules.OpenSettings.openNetworkSettings(packageName, activityName, (data: any) => {
        if (data !== true) {
          resolve(data);
        } else {
          resolve(true);
        }
      });
    });
  };

  const openActivities = async (adsSettingPaths: IAdsSettingPath[]) => {
    let results = [];
    for (let i = 0; i < adsSettingPaths.length; i++) {
      const adsSetting = adsSettingPaths[i];

      const result = await openActivity(adsSetting.package, adsSetting.activity);
      results.push(result);
    }
    const isActivityExists = results.filter(value => {
      return value === true;
    });
    if (isActivityExists.length < 1) {
      // @ts-ignore
      alert(t('ads_detail_app_not_available'));
    }
  };

  const onPressBack = () => {
    navigation.pop();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent={false} backgroundColor={colors.background} />

      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onPressBack} />
        <Appbar.Content title={item.title} />
      </Appbar.Header>
      <ScrollView>
        <View style={[styles.headerContainer, { backgroundColor: `${item.iconBackgroundColor}50` }]}>
          <Icon
            type={item.iconFamily}
            name={item.iconName}
            color={item.iconBackgroundColor}
            size={Dimensions.get('screen').height * 0.1}
          />
        </View>
        <View style={styles.parallexContainerView}>
          <Text style={[styles.adsDetailDescText, { color: colors.text }]}>{t('ads_detail_desc')}</Text>
          <Text style={[styles.detailText, { color: `${colors.text}60` }]}>{item.detail}</Text>
          <Text style={[styles.stepsText, { color: colors.text }]}>{t('ads_detail_steps')}</Text>
          <Text style={[styles.stepsDescText, { color: `${colors.text}60` }]}>{item.steps}</Text>
          {item.id > 0 && item.adsSettingPaths && !item.hideButton && (
            <Button
              labelStyle={styles.bottomButtonLabel}
              style={[styles.bottomButton, { backgroundColor: `${item.iconBackgroundColor}aa` }]}
              icon={() => <Icon type={item.iconFamily} name={item.iconName} color={'white'} size={22} />}
              mode="outlined"
              onPress={() => openActivities(item.adsSettingPaths)}>
              {`${t('OPEN')} ${t(item.appname)} ${t('ads_detail_settings')}`}
            </Button>
          )}
          <Text style={[styles.specialNoteText, { color: colors.error }]}>{item.specialNote}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdsDetails;
