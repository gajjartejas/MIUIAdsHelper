import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

//Third Party
import { TouchableRipple, useTheme, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import CommonIcon, { IconType } from 'app/components/CommonIcon';

//Constants
import { AppTheme } from 'app/models/theme';

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
  AudioVideo = 'home.audio_video',
  ThemeLockScreen = 'home.theme_lock_screen',
  Internet = 'home.internet',
  Utilities = 'home.utilities',
  Security = 'home.security',
  System = 'home.type_system',
  DisableEnable = 'home.type_disable_enable',
  Other = 'home.type_other',
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
  isInstalled?: boolean;
  viewMode?: 'grid' | 'list';
  onPress: (item: IAdsActivity, index: number, sectionIndex: number) => void;
}

const AdsListItem = (props: IAdsListItem) => {
  //Const
  const { colors } = useTheme<AppTheme>();
  const { t } = useTranslation();
  const { item, index, isInstalled = true, viewMode = 'grid' } = props;
  const sectionIndex = props.sectionIndex;


  if (viewMode === 'list') {
    return (
      <View
        style={[
          styles.listContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.outlineVariant,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <TouchableRipple
          rippleColor={`${colors.primary}20`}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. ${item.subtitle}`}
          style={[styles.listTouchableButton, { backgroundColor: colors.card }]}
          onPress={() => props.onPress(item, index, sectionIndex)}
        >
          <View style={styles.listContentWrapper}>
            <View style={[styles.listIconAvatar, { backgroundColor: item.iconBackgroundColor }]}>
              <CommonIcon type={item.iconFamily} name={item.iconName} color={colors.white} size={18} />
            </View>

            <View style={styles.listTextContainer}>
              <Text numberOfLines={1} style={[styles.listTitleText, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.listSubtitleText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {item.subtitle}
              </Text>
            </View>

            <View style={styles.listRightWrapper}>
              {!isInstalled ? (
                <View
                  style={[
                    styles.notInstalledBadge,
                    {
                      backgroundColor: colors.errorContainer,
                      borderColor: colors.error,
                    },
                  ]}
                >
                  <CommonIcon type="material" name="cloud-off-outline" color={colors.onErrorContainer} size={10} />
                  <Text style={[styles.notInstalledBadgeText, { color: colors.onErrorContainer }]}>{t('home.not_installed')}</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.installedBadge,
                    {
                      backgroundColor: colors.secondaryContainer,
                      borderColor: colors.outlineVariant,
                    },
                  ]}
                >
                  <CommonIcon type="material" name="check" color={colors.onSecondaryContainer} size={11} />
                </View>
              )}
              <CommonIcon
                type="material"
                name="chevron-right"
                color={colors.onSurfaceVariant}
                size={18}
                style={styles.listChevron}
              />
            </View>
          </View>
        </TouchableRipple>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.gridContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.outlineVariant,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <TouchableRipple
        rippleColor={`${colors.primary}20`}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.subtitle}`}
        style={[styles.gridTouchableButton, { backgroundColor: colors.card }]}
        onPress={() => props.onPress(item, index, sectionIndex)}
      >
        <View style={styles.gridContentWrapper}>
          <View style={styles.gridTopRow}>
            <View style={[styles.gridIconAvatar, { backgroundColor: item.iconBackgroundColor }]}>
              <CommonIcon type={item.iconFamily} name={item.iconName} color={colors.white} size={20} />
            </View>
            {!isInstalled ? (
              <View
                style={[
                  styles.notInstalledBadge,
                  {
                    backgroundColor: colors.errorContainer,
                    borderColor: colors.error,
                  },
                ]}
              >
                <CommonIcon type="material" name="cloud-off-outline" color={colors.onErrorContainer} size={10} />
                <Text style={[styles.notInstalledBadgeText, { color: colors.onErrorContainer }]}>{t('home.not_installed')}</Text>
              </View>
            ) : (
              <View
                style={[
                  styles.installedBadge,
                  {
                    backgroundColor: colors.secondaryContainer,
                    borderColor: colors.outlineVariant,
                  },
                ]}
              >
                <CommonIcon type="material" name="check" color={colors.onSecondaryContainer} size={11} />
              </View>
            )}
          </View>

          <View style={styles.gridBottomSection}>
            <Text numberOfLines={1} style={[styles.gridTitleText, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.gridSubtitleText, { color: colors.onSurfaceVariant }]}
            >
              {item.subtitle}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  // Grid Styles
  gridContainer: {
    width: '48%',
    minHeight: 136,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  gridTouchableButton: {
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    padding: 12,
  },
  gridContentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridIconAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  gridBottomSection: {
    marginTop: 10,
  },
  gridTitleText: {
    fontWeight: '700',
    fontSize: 13.5,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  gridSubtitleText: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    marginTop: 2,
  },

  // List Styles
  listContainer: {
    width: '100%',
    minHeight: 68,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    elevation: 1.5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  listTouchableButton: {
    borderRadius: 14,
    overflow: 'hidden',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  listContentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
    justifyContent: 'center',
  },
  listTitleText: {
    fontWeight: '700',
    fontSize: 13.5,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  listSubtitleText: {
    fontSize: 11.5,
    fontWeight: '400',
    lineHeight: 15,
    marginTop: 2,
  },
  listRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listChevron: {
    marginLeft: 2,
  },

  // Shared Badges
  notInstalledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 3,
  },
  notInstalledBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  installedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AdsListItem);
