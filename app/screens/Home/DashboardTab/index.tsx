import React, { useCallback, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

//ThirdParty
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import {
  finishTransaction,
  getAvailablePurchases,
  initConnection,
} from 'react-native-iap';

//App modules
import Components from 'app/components';
import styles from './styles';
import Utils from 'app/utils';
import useGetSettingActivities from 'app/config/miui-setting-activities';
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import { IAdsActivity, IAdsActivitySection } from 'app/components/AdsListItem';
import useAppConfigStore from 'app/store/appConfig';
import { showAppDialog } from 'app/store/dialogStore';

//Params
type DashboardTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabsNavigatorParams, 'DashboardTab'>,
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

const DashboardTab = () => {
  //Refs

  //Actions
  const purchased = useAppConfigStore(state => state.purchased);
  const setPurchased = useAppConfigStore(state => state.setPurchased);
  const navigation = useNavigation<DashboardTabNavigationProp>();

  //Constants
  const { colors } = useTheme<AppTheme>();
  const { groupedEntries: allEntries } = useGetSettingActivities();
  const { t } = useTranslation();

  //States
  const [searchText, setSearchText] = useState('');

  const filteredArray = useSearch(allEntries, searchText);

  const cardTapped = useCallback(
    (item: IAdsActivity, _index: number, _sectionIndex: number) => {
      Utils.rateApp.saveItem(item);
      navigation.navigate('AdsDetails', { item: item });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index, sectionIndex }: { item: IAdsActivity; index: number; sectionIndex: number }) => {
      return (
        <Components.AdsListItem
          key={item.id}
          item={item}
          index={index}
          sectionIndex={sectionIndex}
          onPress={cardTapped}
        />
      );
    },
    [cardTapped],
  );

  const onPressMore = () => {
    navigation.navigate('Purchase', { fromTheme: false });
  };

  const onClearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  const onResetDevPurchases = useCallback(async () => {
    try {
      await initConnection();
      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        for (const purchase of purchases) {
          try {
            await finishTransaction({ purchase, isConsumable: true });
          } catch (consumeErr) {
            console.warn('DashboardTab->onResetDevPurchases->consumeErr:', consumeErr);
          }
        }
      }
      setPurchased(false);
      showAppDialog(
        'DEV: Test Purchases Consumed',
        'All purchases have been consumed in Google Play and reset locally. You can now test purchasing again.',
      );
    } catch (e: unknown) {
      console.error('DashboardTab DEV consume error:', e);
      showAppDialog('DEV Reset Error', String(e));
    }
  }, [setPurchased]);

  return (
    <Components.AppBaseView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        style={styles.carouselContainer}>
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
              style={[styles.searchTextInputText, { color: `${colors.onBackground}cc` }]}
            />
            {!!searchText && searchText.length > 0 && (
              <View style={[styles.rightSearchButton]}>
                <IconButton icon={'close'} iconColor={`${colors.text}`} size={22} onPress={onClearSearch} />
              </View>
            )}
            {__DEV__ && (
              <View style={[styles.rightSearchButton]}>
                <IconButton
                  icon={'refresh'}
                  iconColor={colors.error || '#DC143C'}
                  size={20}
                  onPress={onResetDevPurchases}
                />
              </View>
            )}
          </View>
        </View>

        {!purchased && (
          <TouchableRipple onPress={onPressMore} style={[styles.bannerContainer, { backgroundColor: colors.primary }]}>
            <>
              <Text style={[styles.bannerText]}>{t('home.app_support')}</Text>
              <IconButton icon={'arrow-right'} iconColor={`${colors.onPrimary}`} size={22} onPress={onPressMore} />
            </>
          </TouchableRipple>
        )}

        {__DEV__ && purchased && (
          <TouchableRipple
            onPress={onResetDevPurchases}
            style={[styles.bannerContainer, { backgroundColor: colors.error || '#DC143C' }]}>
            <>
              <Text style={[styles.bannerText]}>DEV: Reset / Consume Purchases</Text>
              <IconButton
                icon={'refresh'}
                iconColor={`${colors.onPrimary || '#FFFFFF'}`}
                size={22}
                onPress={onResetDevPurchases}
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
    </Components.AppBaseView>
  );
};

export default DashboardTab;
