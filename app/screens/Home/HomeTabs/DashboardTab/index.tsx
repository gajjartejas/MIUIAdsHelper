import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, TextInput, View } from 'react-native';

//ThirdParty
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

//App modules
import Components from 'app/components';
import styles from './styles';
import useGetSettingActivities from 'app/config/miui-setting-activities';
import { IAdsActivity, IAdsActivitySection } from 'app/components/AdsListItem';
import Utils from 'app/utils';
import IState from 'app/models/models/appState';
import { updatePurchase } from 'app/store/actions/appConfigActions';
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { AppTheme } from 'app/models/theme';
import { getAvailablePurchases, initConnection } from 'react-native-iap';

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
  const purchased = useSelector((state: IState) => state.appConfigReducer.purchased);
  const navigation = useNavigation<DashboardTabNavigationProp>();

  //Constants
  const { colors } = useTheme<AppTheme>();
  const { groupedEntries: allEntries } = useGetSettingActivities();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //States
  const [searchText, setSearchText] = useState('');

  const filteredArray = useSearch(allEntries, searchText);

  //States
  useEffect(() => {
    (async () => {
      await initConnection();
      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        dispatch(updatePurchase(true));
      }
    })();
  }, [dispatch]);

  const cardTapped = (item: IAdsActivity, _index: number, _sectionIndex: number) => {
    Utils.rateApp.saveItem(item);
    navigation.navigate('AdsDetails', { item: item });
  };

  const renderItem = ({ item, index, sectionIndex }: { item: IAdsActivity; index: number; sectionIndex: number }) => {
    return (
      <Components.AdsListItem
        key={item.id}
        item={item}
        index={index}
        sectionIndex={sectionIndex}
        onPress={cardTapped}
      />
    );
  };

  const onPressMore = () => {
    navigation.navigate('Purchase', { fromTheme: false });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />

      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false} style={styles.carouselContainer}>
        <View style={[styles.headerDetailContainer, { backgroundColor: `${colors.background}DD` }]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.leftSearchButton, { backgroundColor: colors.surface }]}>
              <IconButton icon={'magnify'} iconColor={`${colors.text}${colors.opacity}`} size={22} />
            </View>
            <TextInput
              value={searchText}
              onChangeText={v => setSearchText(v)}
              placeholder={t('home.search_text')!}
              placeholderTextColor={`${colors.text}${colors.opacity}`}
              style={[styles.searchTextInputText, { color: colors.onBackground }]}
            />
            <View style={[styles.rightSearchButton, { backgroundColor: colors.surface }]}>
              <IconButton
                icon={purchased ? 'emoticon-happy' : 'lock'}
                iconColor={`${colors.text}${colors.opacity}`}
                size={22}
                onPress={onPressMore}
              />
            </View>
          </View>
        </View>

        {!purchased && (
          <TouchableRipple onPress={onPressMore} style={[styles.bannerContainer, { backgroundColor: colors.primary }]}>
            <>
              <Text style={[styles.bannerText]}>{t('home.app_support')}</Text>
              <IconButton
                icon={'arrow-right'}
                iconColor={`${colors.text}${colors.opacity}`}
                size={22}
                onPress={onPressMore}
              />
            </>
          </TouchableRipple>
        )}

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
    </View>
  );
};

export default DashboardTab;
