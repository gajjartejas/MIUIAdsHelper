import React, { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

//ThirdParty
import { IconButton, Text, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { useTranslation } from 'react-i18next';

//App modules
import Components from 'app/components';
import styles from './styles';
import Utils from 'app/utils';
import useGetSettingActivities from 'app/config/miui-setting-activities';
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import { IAdsActivity, IAdsActivitySection, IAdsSettingAppType } from 'app/components/AdsListItem';
import useAppConfigStore from 'app/store/appConfig';

//Params
type DashboardTabNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<HomeTabsNavigatorParams, 'DashboardTab'>,
  NativeStackNavigationProp<LoggedInTabNavigatorParams>
>;

export function useSearch(array: IAdsActivitySection[], searchTerm: string): IAdsActivitySection[] {
  if (!searchTerm || searchTerm.trim().length < 1) {
    return array;
  }
  return array
    .map(entry => {
      let filteredData = entry.data.filter(
        v =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return {
        title: entry.title,
        data: filteredData,
      };
    })
    .filter(v => v.data.length > 0);
}

const DashboardTab = ({}: any) => {
  //Refs

  //Actions
  const purchased = useAppConfigStore(state => state.purchased);
  const navigation = useNavigation<DashboardTabNavigationProp>();

  //Constants
  const { colors } = useTheme<AppTheme>();
  const { groupedEntries: allEntries } = useGetSettingActivities();
  const { t } = useTranslation();

  //States
  const [searchText, setSearchText] = useState('');

  const filteredArray = useSearch(allEntries, searchText);

  const cardTapped = (item: IAdsActivity, _index: number, _sectionIndex: number) => {
    const freeUnlockForCategories =
      item.appType === IAdsSettingAppType.AudioVideo ||
      item.appType === IAdsSettingAppType.ThemeLockScreen ||
      item.appType === IAdsSettingAppType.Utilities ||
      item.appType === IAdsSettingAppType.Internet ||
      item.appType === IAdsSettingAppType.Security;

    if (!freeUnlockForCategories && !purchased) {
      navigation.navigate('Purchase', { route: 'AdsDetails', params: { item: item } });
      return;
    }
    Utils.rateApp.saveItem(item);
    navigation.navigate('AdsDetails', { item: item });
  };

  const renderItem = ({ item, index, sectionIndex }: { item: IAdsActivity; index: number; sectionIndex: number }) => {
    const freeUnlockForCategories =
      item.appType === IAdsSettingAppType.AudioVideo ||
      item.appType === IAdsSettingAppType.ThemeLockScreen ||
      item.appType === IAdsSettingAppType.Utilities ||
      item.appType === IAdsSettingAppType.Internet ||
      item.appType === IAdsSettingAppType.Security;
    return (
      <Components.AdsListItem
        key={item.id}
        item={item}
        index={index}
        sectionIndex={sectionIndex}
        onPress={cardTapped}
        locked={!freeUnlockForCategories && !purchased}
      />
    );
  };

  const onClearSearch = () => {
    setSearchText('');
  };

  return (
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false} style={styles.carouselContainer}>
        <View style={[styles.headerDetailContainer, { backgroundColor: `${colors.background}DD` }]}>
          <View style={[styles.searchContainer, { backgroundColor: `${colors.onBackground}20` }]}>
            <View style={[styles.leftSearchButton]}>
              <IconButton icon={'magnify'} iconColor={`${colors.text}`} size={22} />
            </View>
            <TextInput
              value={searchText}
              onChangeText={v => setSearchText(v)}
              placeholder={t('home.search_text')!}
              placeholderTextColor={`${colors.text}`}
              style={[styles.searchTextInputText, { color: `${colors.onBackground}20` }]}
            />
            {!!searchText && searchText.length > 0 && (
              <View style={[styles.rightSearchButton]}>
                <IconButton icon={'close'} iconColor={`${colors.text}`} size={22} onPress={onClearSearch} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.listContainer}>
          {filteredArray.map((section, sectionIndex) => {
            return (
              <View style={styles.section} key={section.title}>
                <Text style={[styles.sectionHeader]}>{t(section.title)}</Text>
                <View style={styles.sectionItem}>
                  {section.data.map((item, index) => {
                    return renderItem({ item, index, sectionIndex });
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Components.AppBaseView>
  );
};

export default DashboardTab;
