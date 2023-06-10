import React, { useEffect, useRef } from 'react';
import { Text, View, NativeModules, ScrollView, Dimensions, StatusBar, Alert } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';

//App Modules
import styles from './styles';
import { IAdsActivity, IAdsSettingPath } from 'app/components/AdsListItem';
import { AppTheme } from 'app/models/theme';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'AdsDetails'>;

const AdsDetails = ({ route, navigation }: Props) => {
  //Refs
  const refDeviceInfo = useRef<any | null>(null);

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const item = route.params.item;

  useEffect(() => {
    analytics()
      .logScreenView({
        screen_name: item.title,
        screen_class: 'AdsDetail',
      })
      .then(_r => {});
  }, [item.title]);

  const openActivity = (packageName: string | null, activityName: string | null) => {
    return new Promise((resolve, _reject) => {
      NativeModules.OpenSettings.openNetworkSettings(packageName, activityName, (data: any) => {
        if (data !== true) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };

  const logEvent = async (adsActivity: IAdsActivity, openBy: IAdsSettingPath | null) => {
    if (!refDeviceInfo.current) {
      refDeviceInfo.current = await getDeviceInfo();
    }
    await analytics().logEvent('open_ads_settings', {
      id: adsActivity.id,
      appName: adsActivity.appname,
      openBy: openBy?.activity,
      success: openBy !== null,
      ...refDeviceInfo.current,
    });
  };

  const openActivities = async (adsActivity: IAdsActivity) => {
    let isActivityExists = false;
    for (let i = 0; i < adsActivity.adsSettingPaths.length; i++) {
      const adsSetting = adsActivity.adsSettingPaths[i];
      const result = await openActivity(adsSetting.package, adsSetting.activity);

      if (result) {
        isActivityExists = true;
        logEvent(adsActivity, adsSetting);
        break;
      }
    }
    if (!isActivityExists) {
      logEvent(adsActivity, null);
      Alert.alert(t('ads_detail_app_not_available'));
    }
  };

  const getDeviceInfo = async () => {
    let brand = DeviceInfo.getBrand();
    let buildNumber = DeviceInfo.getBuildNumber();
    let nickName = await DeviceInfo.getDevice();
    let appVersion = DeviceInfo.getReadableVersion();
    let systemVersion = DeviceInfo.getSystemVersion();
    let buildId = await DeviceInfo.getBuildId();
    return {
      brand,
      buildNumber,
      nickName,
      appVersion,
      systemVersion,
      buildId,
    };
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
          {item.adsSettingPaths && !item.hideButton && (
            <Button
              labelStyle={styles.bottomButtonLabel}
              style={[styles.bottomButton, { backgroundColor: `${item.iconBackgroundColor}aa` }]}
              icon={() => <Icon type={item.iconFamily} name={item.iconName} color={'white'} size={22} />}
              mode="contained"
              onPress={() => openActivities(item)}>
              {`${t('ads_detail_open')} ${t(item.appname)}`}
            </Button>
          )}
          <Text style={[styles.specialNoteText, { color: colors.error }]}>{item.specialNote}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdsDetails;
