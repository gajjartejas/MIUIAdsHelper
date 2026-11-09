import React, { useCallback, useEffect, useMemo } from 'react';
import { NativeModules, ScrollView, Text, TouchableOpacity, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CommonIcon from 'app/components/CommonIcon';
import ParsedText from 'react-native-parsed-text';

//App Modules
import styles from './styles';
import { IAdsActivity } from 'app/components/AdsListItem';
import { AppTheme } from 'app/models/theme';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import analytics from 'app/services/analytics';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';
import useAppConfigStore from 'app/store/appConfig';
import useThemeConfigStore from 'app/store/themeConfig';
import { showAppDialog } from 'app/store/dialogStore';
import { openSettingPaths } from 'app/utils/openSettingPaths';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'AdsDetails'>;

const AdsDetails = ({ route, navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const isDark = useThemeConfigStore(state => state.isDark);
  const item = route.params.item;
  const purchased = useAppConfigStore(state => state.purchased);

  const canOpenSettings = Boolean(item.adsSettingPaths && !item.hideButton);

  useEffect(() => {
    analytics()
      .logScreenView({
        screen_name: item.title,
        screen_class: 'AdsDetail',
      })
      .then(_r => {});
  }, [item]);

  const openActivity = useCallback((packageName: string | null, activityName: string | null): Promise<boolean> => {
    return new Promise(resolve => {
      if (!NativeModules.OpenSettings || typeof NativeModules.OpenSettings.openNetworkSettings !== 'function') {
        resolve(false);
        return;
      }
      try {
        NativeModules.OpenSettings.openNetworkSettings(packageName, activityName, (data: boolean | unknown) => {
          if (data === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } catch {
        resolve(false);
      }
    });
  }, []);

  const openAppDetails = useCallback((packageName: string | null): Promise<boolean> => {
    return new Promise(resolve => {
      const openFn = NativeModules.OpenSettings?.openAppSettings || NativeModules.OpenSettings?.openAppDetailsSettings;

      if (typeof openFn !== 'function') {
        resolve(false);
        return;
      }
      try {
        openFn(packageName, (data: boolean | unknown) => {
          resolve(data === true);
        });
      } catch {
        resolve(false);
      }
    });
  }, []);

  const openActivities = useCallback(
    async (adsActivity: IAdsActivity) => {
      const openedPath = await openSettingPaths(adsActivity.adsSettingPaths, openActivity, openAppDetails);
      if (!openedPath) {
        showAppDialog(t('ads_detail_app_not_available'));
      }
    },
    [openActivity, openAppDetails, t],
  );

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressMore = useCallback(() => {
    navigation.navigate('Purchase', { fromTheme: false });
  }, [navigation]);

  const regex = useMemo(() => {
    return /\*\*(.*?)\*\*/g;
  }, []);

  const extractTextBetweenStars = useCallback(
    (text: string) => {
      const matches = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
      }
      return matches;
    },
    [regex],
  );

  const renderText = useCallback(
    (matchingString: string) => {
      let match = matchingString.match(regex);
      return `${extractTextBetweenStars(match ? match[0] : '')}`;
    },
    [extractTextBetweenStars, regex],
  );

  // Parse step lines
  const stepLines = useMemo(() => {
    if (!item.steps) return [];
    return item.steps.split('\n').filter(line => line.trim().length > 0);
  }, [item.steps]);

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={item.title}
        tintColor={colors.text}
        style={{ backgroundColor: colors.background }}
      />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            canOpenSettings ? { paddingBottom: 84 } : { paddingBottom: 36 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Card */}
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: isDark ? '#1C1B24' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <View style={styles.heroContentRow}>
              <View style={styles.heroLeftContent}>
                <View style={[styles.heroIconAvatar, { backgroundColor: item.iconBackgroundColor }]}>
                  <CommonIcon type={item.iconFamily} name={item.iconName} color="#FFFFFF" size={26} />
                </View>
                <View style={styles.heroTextContainer}>
                  <Text style={[styles.heroTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text
                    style={[
                      styles.heroSubtitle,
                      { color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.55)' },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                  <View style={styles.heroBadgeRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.65)' },
                        ]}
                      >
                        {t(item.appType)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Quick Open Button in Hero Card */}
              {canOpenSettings && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openActivities(item)}
                  style={[styles.heroOpenChip, { backgroundColor: item.iconBackgroundColor || colors.primary }]}
                >
                  <CommonIcon type="material" name="open-in-new" color="#FFFFFF" size={14} />
                  <Text style={styles.heroOpenChipText}>{t('ads_detail_open')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Support App Banner */}
          {!purchased && (
            <TouchableRipple
              onPress={onPressMore}
              style={[
                styles.bannerContainer,
                {
                  backgroundColor: isDark ? 'rgba(220, 20, 60, 0.12)' : '#FFF1F3',
                  borderColor: isDark ? 'rgba(220, 20, 60, 0.28)' : '#FFD2D8',
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

          {/* Description Card */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: isDark ? '#1C1B24' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <View style={styles.sectionTitleRow}>
              <CommonIcon type="material" name="information-outline" color={colors.primary} size={18} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('ads_detail_desc')}</Text>
            </View>
            <Text style={[styles.detailText, { color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.75)' }]}>
              {item.detail}
            </Text>
          </View>

          {/* Steps Card */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: isDark ? '#1C1B24' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <View style={styles.sectionTitleRow}>
              <CommonIcon type="material" name="format-list-numbered" color={colors.primary} size={18} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('ads_detail_steps')}</Text>
            </View>

            {stepLines.map((line, idx) => {
              const stepNumMatch = line.match(/^(\d+)\.\s*(.*)/);
              const stepNumber = stepNumMatch ? stepNumMatch[1] : String(idx + 1);
              const stepBody = stepNumMatch ? stepNumMatch[2] : line;

              return (
                <View key={idx} style={styles.stepItemRow}>
                  <View
                    style={[styles.stepNumberBadge, { backgroundColor: item.iconBackgroundColor || colors.primary }]}
                  >
                    <Text style={styles.stepNumberText}>{stepNumber}</Text>
                  </View>
                  <ParsedText
                    parse={[
                      {
                        pattern: regex,
                        style: [styles.boldText, { color: colors.text }],
                        renderText: renderText,
                      },
                    ]}
                    childrenProps={{ allowFontScaling: false }}
                    style={[styles.stepText, { color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.75)' }]}
                  >
                    {stepBody}
                  </ParsedText>
                </View>
              );
            })}
          </View>

          {/* Special Note Callout */}
          {!!item.specialNote && item.specialNote.trim().length > 0 && (
            <View
              style={[
                styles.specialNoteCard,
                {
                  backgroundColor: isDark ? 'rgba(255, 152, 0, 0.12)' : '#FFF8E1',
                  borderColor: isDark ? 'rgba(255, 152, 0, 0.3)' : '#FFE082',
                },
              ]}
            >
              <CommonIcon
                type="material"
                name="alert-circle-outline"
                color={isDark ? '#FFB74D' : '#E65100'}
                size={18}
              />
              <Text style={[styles.specialNoteText, { color: isDark ? '#FFB74D' : '#E65100' }]}>
                {item.specialNote}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button on Top / Pinned Bottom */}
        {canOpenSettings && (
          <View
            style={[
              styles.floatingBottomContainer,
              {
                backgroundColor: isDark ? `${colors.background}F2` : `${colors.background}F5`,
                borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openActivities(item)}
              style={[styles.actionButton, { backgroundColor: item.iconBackgroundColor || colors.primary }]}
            >
              <CommonIcon type={item.iconFamily} name={item.iconName} color="#FFFFFF" size={18} />
              <Text style={styles.actionButtonText}>{`${t('ads_detail_open')} ${t(item.appname)}`}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Components.AppBaseView>
  );
};

export default AdsDetails;
