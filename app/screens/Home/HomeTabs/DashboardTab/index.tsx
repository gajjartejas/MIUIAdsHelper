import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, NativeModules, StatusBar } from 'react-native';

//ThirdParty
import { IconButton, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

//App modules
import Components from 'app/components';
import styles from './styles';
import useGetSettingActivities from 'app/config/miui-setting-activities';
import { IAdsActivity } from 'app/components/AdsListItem';
import Utils from 'app/utils';
import Config from 'app/config';
import IState from 'app/models/models/appState';
import { useSelector } from 'react-redux';

//Params
type RootStackParamList = {
  DashboardTab: { userId: string };
  AdsDetail: { item: IAdsActivity };
  Purchase: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DashboardTab'>;

const DashboardTab = ({ navigation }: Props) => {
  //Refs

  //Actions
  const purchased = useSelector((state: IState) => state.appConfigReducer.purchased);

  //Constants
  const { colors } = useTheme();
  const { groupedEntries } = useGetSettingActivities();
  const { t } = useTranslation();

  //States
  const [miuiVersion, setMiuiVersion] = useState('');

  useEffect(() => {
    NativeModules.OpenSettings.readMIVersion().then((v: any) => {
      setMiuiVersion(`MIUI ${v.versionCode}`);
    });
  });

  const cardTapped = (item: IAdsActivity, _index: number) => {
    Utils.rateApp.saveItem(item);
    navigation.navigate('AdsDetail', { item: item });
  };

  const renderItem = ({ item, index }: { item: IAdsActivity; index: number }) => {
    return <Components.AdsListItem key={item.id} item={item} index={index} onPress={cardTapped} />;
  };

  const onPressMore = () => {
    navigation.navigate('Purchase', {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />

      <ScrollView style={styles.carouselContainer}>
        <Image source={Config.Images.icons.home_header} style={styles.headerImage} />

        <View style={styles.headerDetailContainer}>
          <View>
            <Text style={styles.headerDetailText}>{t('miui_version', { version: miuiVersion })}</Text>
            <Text style={styles.headerDetailText}>
              {t('android_version', { version: DeviceInfo.getSystemVersion() })}
            </Text>
          </View>
          {!purchased && <IconButton icon="lock" color={colors.primary} size={30} onPress={onPressMore} />}
        </View>

        <View style={styles.listContainer}>
          {groupedEntries.map((section, _sectionIndex) => {
            return (
              <View style={styles.section} key={section.title}>
                <Text style={styles.sectionHeader}>{t(section.title)}</Text>
                <View style={styles.sectionItem}>
                  {section.data.map((item, index) => {
                    return renderItem({ item, index });
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardTab;
