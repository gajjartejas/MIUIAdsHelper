import React, { useEffect, useRef } from 'react';
import { Text, View, NativeModules, ScrollView, Dimensions, Alert } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, IconButton, TouchableRipple, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';

//App Modules
import styles from './styles';
import { IAdsActivity, IAdsSettingPath } from 'app/components/AdsListItem';
import { AppTheme } from 'app/models/theme';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';
import useAppConfigStore from 'app/store/appConfig';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'AdsDetails'>;

const AdsDetails = ({ route, navigation }: Props) => {
  //Refs
  const refDeviceInfo = useRef<any | null>(null);

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const item = route.params.item;
  const purchased = useAppConfigStore(state => state.purchased);

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

  const onGoBack = () => {
    navigation.pop();
  };

  const onPressMore = () => {
    navigation.navigate('Purchase', { fromTheme: false });
  };

  return (
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={item.title}
        style={{ backgroundColor: colors.background }}
      />

      <ScrollView stickyHeaderIndices={[0]}>
        {!purchased && (
          <TouchableRipple onPress={onPressMore} style={[styles.bannerContainer, { backgroundColor: colors.primary }]}>
            <View style={styles.bannerContainer1}>
              <Text style={[styles.bannerText]}>{t('home.app_support')}</Text>
              <IconButton icon={'arrow-right'} iconColor={`${colors.onPrimary}`} size={22} onPress={onPressMore} />
            </View>
          </TouchableRipple>
        )}

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
              style={[styles.bottomButton, { backgroundColor: `${item.iconBackgroundColor}` }]}
              icon={() => <Icon type={item.iconFamily} name={item.iconName} color={'white'} size={22} />}
              mode="contained"
              onPress={() => openActivities(item)}>
              {`${t('ads_detail_open')} ${t(item.appname)}`}
            </Button>
          )}
          <Text style={[styles.specialNoteText, { color: colors.error }]}>{item.specialNote}</Text>
        </View>
      </ScrollView>
    </Components.AppBaseView>
  );
};

export default AdsDetails;
