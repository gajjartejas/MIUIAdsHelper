import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

//ThirdParty
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { finishTransaction, getAvailablePurchases, initConnection } from 'react-native-iap';

//App modules
import Components from 'app/components';
import CommonIcon from 'app/components/CommonIcon';
import styles from './styles';
import Utils from 'app/utils';
import useGetSettingActivities from 'app/config/miui-setting-activities';
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import { IAdsActivity, IAdsActivitySection, IAdsSettingAppType } from 'app/components/AdsListItem';
import useAppConfigStore from 'app/store/appConfig';
import useThemeConfigStore from 'app/store/themeConfig';
import { showAppDialog } from 'app/store/dialogStore';
import useInstalledPackages from 'app/hooks/useInstalledPackages';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

//Params
type DashboardTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabsNavigatorParams, 'DashboardTab'>,
  NativeStackNavigationProp<LoggedInTabNavigatorParams>
>;

export function useSearch(
  array: IAdsActivitySection[],
  searchTerm: string,
  filterType: 'all' | 'installed' | 'to_disable',
  isItemInstalled: (item: IAdsActivity) => boolean,
): IAdsActivitySection[] {
  const trimmed = searchTerm ? searchTerm.trim().toLowerCase() : '';
  return array
    .map(entry => {
      const filteredData = entry.data.filter(v => {
        const matchesSearch =
          !trimmed ||
          entry.title.toLowerCase().includes(trimmed) ||
          v.title.toLowerCase().includes(trimmed) ||
          v.appname.toLowerCase().includes(trimmed);

        let matchesFilter = false;
        if (filterType === 'all') {
          matchesFilter = v.appType !== IAdsSettingAppType.DisableEnable;
        } else if (filterType === 'installed') {
          matchesFilter = v.appType !== IAdsSettingAppType.DisableEnable && isItemInstalled(v);
        } else if (filterType === 'to_disable') {
          matchesFilter = v.appType === IAdsSettingAppType.DisableEnable && isItemInstalled(v);
        }

        return matchesSearch && matchesFilter;
      });
      return {
        title: entry.title,
        data: filteredData,
      };
    })
    .filter(v => v.data.length > 0);
}
let __DEV__ = false;
const DashboardTab = () => {
  //Actions
  const purchased = true; //useAppConfigStore(state => state.purchased);
  const setPurchased = useAppConfigStore(state => state.setPurchased);
  const viewMode = useAppConfigStore(state => state.viewMode || 'grid');
  const setViewMode = useAppConfigStore(state => state.setViewMode);
  const isDark = useThemeConfigStore(state => state.isDark);
  const navigation = useNavigation<DashboardTabNavigationProp>();

  //Constants
  const { colors } = useTheme<AppTheme>();
  const { entries: allFlatEntries, groupedEntries: allEntries } = useGetSettingActivities();
  const { t } = useTranslation();

  //Installed packages detection
  const { isItemInstalled } = useInstalledPackages(allFlatEntries);

  //States
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'installed' | 'to_disable'>('installed');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const filteredArray = useSearch(allEntries, searchText, filterType, isItemInstalled);

  const onSelectFilter = useCallback((type: 'all' | 'installed' | 'to_disable') => {
    setFilterType(type);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  //Counts
  const allGuidesCount = useMemo(
    () => allFlatEntries.filter(v => v.appType !== IAdsSettingAppType.DisableEnable).length,
    [allFlatEntries],
  );
  const installedGuidesCount = useMemo(
    () => allFlatEntries.filter(v => v.appType !== IAdsSettingAppType.DisableEnable && isItemInstalled(v)).length,
    [allFlatEntries, isItemInstalled],
  );
  const toDisableCount = useMemo(
    () => allFlatEntries.filter(v => v.appType === IAdsSettingAppType.DisableEnable && isItemInstalled(v)).length,
    [allFlatEntries, isItemInstalled],
  );

  const cardTapped = useCallback(
    (item: IAdsActivity, _index: number, _sectionIndex: number) => {
      Utils.rateApp.saveItem(item);
      navigation.navigate('AdsDetails', { item: item });
    },
    [navigation],
  );

  const toggleSectionCollapse = useCallback((sectionTitle: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  }, []);

  const toggleViewMode = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  }, [viewMode, setViewMode]);

  const renderItem = useCallback(
    ({ item, index, sectionIndex }: { item: IAdsActivity; index: number; sectionIndex: number }) => {
      return (
        <Components.AdsListItem
          key={item.id}
          item={item}
          index={index}
          sectionIndex={sectionIndex}
          isInstalled={isItemInstalled(item)}
          viewMode={viewMode}
          onPress={cardTapped}
        />
      );
    },
    [cardTapped, isItemInstalled, viewMode],
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
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Fixed Header with Search & Filter Chips (always on top & always clickable) */}
      <View
        style={[
          styles.headerStickyContainer,
          {
            backgroundColor: isDark ? `${colors.background}F2` : `${colors.background}F5`,
          },
        ]}
      >
        {/* Search Input Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDark ? '#1E1D2A' : '#F2F3F7',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          <View style={styles.leftSearchButton}>
            <CommonIcon
              type="material"
              name="magnify"
              color={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'}
              size={22}
            />
          </View>
          <TextInput
            value={searchText}
            onChangeText={v => setSearchText(v)}
            placeholder={t('home.search_text')!}
            placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
            style={[styles.searchTextInputText, { color: colors.text }]}
          />
          {!!searchText && searchText.length > 0 && (
            <View style={styles.rightSearchButton}>
              <IconButton
                icon="close-circle"
                iconColor={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'}
                size={18}
                onPress={onClearSearch}
              />
            </View>
          )}
          {__DEV__ && (
            <View style={styles.rightSearchButton}>
              <IconButton
                icon="refresh"
                iconColor={colors.error || '#DC143C'}
                size={18}
                onPress={onResetDevPurchases}
              />
            </View>
          )}
        </View>

        {/* Filter Pills & View Mode Switcher */}
        <View style={styles.filterRowContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled={true}
            contentContainerStyle={styles.filterPillScrollContent}
            style={styles.filterPillScrollView}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectFilter('installed')}
              style={[
                styles.filterPill,
                filterType === 'installed'
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }
                  : {
                      backgroundColor: isDark ? '#1E1D2A' : '#F2F3F7',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    },
              ]}
            >
              <CommonIcon
                type="material"
                name="check-circle-outline"
                color={
                  filterType === 'installed' ? '#FFFFFF' : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }
                size={15}
              />
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color:
                      filterType === 'installed'
                        ? '#FFFFFF'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.85)'
                        : 'rgba(0, 0, 0, 0.75)',
                  },
                ]}
              >
                {t('home.filter_installed')} ({installedGuidesCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectFilter('all')}
              style={[
                styles.filterPill,
                filterType === 'all'
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }
                  : {
                      backgroundColor: isDark ? '#1E1D2A' : '#F2F3F7',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    },
              ]}
            >
              <CommonIcon
                type="material"
                name="view-grid-outline"
                color={filterType === 'all' ? '#FFFFFF' : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'}
                size={15}
              />
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color:
                      filterType === 'all' ? '#FFFFFF' : isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
                  },
                ]}
              >
                {t('home.filter_all')} ({allGuidesCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSelectFilter('to_disable')}
              style={[
                styles.filterPill,
                filterType === 'to_disable'
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }
                  : {
                      backgroundColor: isDark ? '#1E1D2A' : '#F2F3F7',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    },
              ]}
            >
              <CommonIcon
                type="material"
                name="cancel"
                color={
                  filterType === 'to_disable' ? '#FFFFFF' : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }
                size={15}
              />
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color:
                      filterType === 'to_disable'
                        ? '#FFFFFF'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.85)'
                        : 'rgba(0, 0, 0, 0.75)',
                  },
                ]}
              >
                {t('home.filter_to_disable')} ({toDisableCount})
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Grid / List View Mode Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleViewMode}
            style={[
              styles.viewModeToggleButton,
              {
                backgroundColor: isDark ? '#1E1D2A' : '#F2F3F7',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <CommonIcon
              type="material"
              name={viewMode === 'grid' ? 'view-list-outline' : 'view-grid-outline'}
              color={colors.primary}
              size={18}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        style={styles.carouselContainer}
      >
        {/* Support App Banner */}
        {!purchased && (
          <TouchableRipple
            onPress={onPressMore}
            style={[
              styles.bannerContainer,
              {
                backgroundColor: isDark ? `${colors.primary}1A` : `${colors.primary}10`,
                borderColor: isDark ? `${colors.primary}4D` : `${colors.primary}33`,
              },
            ]}
          >
            <>
              <View style={[styles.bannerIconWrapper, { backgroundColor: colors.primary }]}>
                <CommonIcon type="material" name="palette-outline" color="#FFFFFF" size={20} />
              </View>
              <View style={styles.bannerContent}>
                <Text style={[styles.bannerTitle, { color: colors.text }]}>{t('iap_navigation_title')}</Text>
                <Text
                  style={[
                    styles.bannerSubtitle,
                    { color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.6)' },
                  ]}
                >
                  {t('home.app_support')}
                </Text>
              </View>
              <CommonIcon
                type="material"
                name="chevron-right"
                color={colors.primary}
                size={22}
                style={styles.bannerActionArrow}
              />
            </>
          </TouchableRipple>
        )}

        {/* DEV Reset Banner */}
        {__DEV__ && purchased && (
          <TouchableRipple
            onPress={onResetDevPurchases}
            style={[
              styles.bannerContainer,
              {
                backgroundColor: isDark ? 'rgba(244, 67, 54, 0.12)' : '#FFF0F0',
                borderColor: isDark ? 'rgba(244, 67, 54, 0.3)' : '#FFCDD2',
              },
            ]}
          >
            <>
              <View style={[styles.bannerIconWrapper, { backgroundColor: colors.error || '#DC143C' }]}>
                <CommonIcon type="material" name="refresh" color="#FFFFFF" size={20} />
              </View>
              <View style={styles.bannerContent}>
                <Text style={[styles.bannerTitle, { color: colors.text }]}>DEV: Reset / Consume Purchases</Text>
                <Text
                  style={[
                    styles.bannerSubtitle,
                    { color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.55)' },
                  ]}
                >
                  Tap to clear in-app purchases and test again
                </Text>
              </View>
              <CommonIcon
                type="material"
                name="chevron-right"
                color={colors.error || '#DC143C'}
                size={22}
                style={styles.bannerActionArrow}
              />
            </>
          </TouchableRipple>
        )}

        {/* Section List / Empty State */}
        {filteredArray.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CommonIcon
              type="material"
              name={filterType === 'to_disable' ? 'shield-check-outline' : 'cloud-search-outline'}
              size={52}
              color={
                filterType === 'to_disable' ? '#4CAF50' : isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)'
              }
            />
            <Text style={[styles.emptyTitleText, { color: colors.text }]}>
              {filterType === 'to_disable' ? t('home.no_to_disable_apps') : t('home.no_installed_apps')}
            </Text>
            <Text
              style={[styles.emptySubtitleText, { color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)' }]}
            >
              {filterType === 'to_disable'
                ? t('home.dashboard_empty_to_disable') ||
                  'No optional background services or partner apps were detected on your device.'
                : 'Try searching for a different keyword or switch to All Guides'}
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredArray.map((section, sectionIndex) => {
              const isCollapsed = Boolean(collapsedSections[section.title]);
              return (
                <View style={styles.section} key={section.title}>
                  {/* Collapsible Section Header */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleSectionCollapse(section.title)}
                    style={styles.sectionHeaderTouchable}
                  >
                    <View style={styles.sectionHeaderLeft}>
                      <Text style={[styles.sectionHeader, { color: colors.text }]}>{t(section.title)}</Text>
                      <View
                        style={[
                          styles.sectionCountBadge,
                          {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.sectionCountText,
                            { color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)' },
                          ]}
                        >
                          {section.data.length}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.sectionChevronWrapper,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      ]}
                    >
                      <CommonIcon
                        type="material"
                        name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                        color={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'}
                        size={18}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Section Content (Grid or List) */}
                  {!isCollapsed && (
                    <View style={viewMode === 'grid' ? styles.sectionGridItem : styles.sectionListItem}>
                      {section.data.map((item, index) => {
                        return renderItem({ item, index, sectionIndex });
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Components.AppBaseView>
  );
};

export default DashboardTab;
