import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Divider, List, useTheme } from 'react-native-paper';

//App modules
import Config from 'app/config';
import Utils from 'app/utils';
import styles from './styles';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Modals
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';
import Icon from 'react-native-easy-icon';
import Components from 'app/components';
import AppHeader from 'app/components/AppHeader';
import useAppLangConfigStore from 'app/store/appLangConfig';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Settings'>;

const Settings = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const largeScreenMode = useLargeScreenMode();
  const selectedLanguageName = useAppLangConfigStore(store => store.selectedLanguageName);

  //States
  const apps: ISettingSection[] = useMemo(() => {
    return [
      {
        id: 0,
        title: t('settings.commonHeader'),
        items: [
          {
            id: 0,
            iconName: 'language',
            iconType: 'material',
            title: t('settings.languageTitle'),
            description: t('settings.languageSubTitle', {
              id10001: selectedLanguageName,
            })!,
            route: 'ChangeLanguage',
          },
          {
            id: 1,
            iconName: 'wb-sunny',
            iconType: 'material',
            title: t('settings.appearanceTitle'),
            description: t('settings.appearanceSubTitle')!,
            route: 'SelectAppearance',
          },
        ],
      },
      {
        id: 1,
        title: t('settings.infoHeader'),
        items: [
          {
            id: 0,
            iconName: 'notes',
            iconType: 'material',
            title: t('settings.changelogTitle'),
            description: t('settings.changelogSubTitle')!,
            route: 'Changelog',
          },
          {
            id: 1,
            iconName: 'library-shelves',
            iconType: 'material-community',
            title: t('settings.librariesTitle'),
            description: t('settings.librariesSubTitle')!,
            route: 'License',
          },
          {
            id: 2,
            iconName: 'frequently-asked-questions',
            iconType: 'material-community',
            title: t('settings.faqTitle'),
            description: t('settings.faqSubTitle')!,
            route: 'FAQ',
          },
          {
            id: 3,
            iconName: 'language-outline',
            iconType: 'ionicon',
            title: t('settings.translateTitle'),
            description: t('settings.translateSubTitle')!,
            route: 'Translate',
          },
          {
            id: 4,
            iconName: 'people-outline',
            iconType: 'ionicon',
            title: t('settings.translatorsTitle'),
            description: t('settings.translatorsSubTitle')!,
            route: 'Translators',
          },
          {
            id: 5,
            iconName: 'privacy-tip',
            iconType: 'material',
            title: t('settings.privacyTitle'),
            description: t('settings.privacySubTitle')!,
            route: 'PrivacyPolicy',
          },
        ],
      },
    ];
  }, [selectedLanguageName, t]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPress = useCallback(
    async (item: ISettingItem, _index: number) => {
      switch (item.route) {
        case 'Changelog':
          await Utils.openInAppBrowser(Config.Constants.CHANGE_LOG);
          break;

        case 'Translate':
          await Utils.openInAppBrowser(Config.Constants.TRANSLATE_APP);
          break;

        case 'FAQ':
          await Utils.openInAppBrowser(Config.Constants.FAQ);
          break;

        case 'PrivacyPolicy':
          await Utils.openInAppBrowser(Config.Constants.PRIVACY_POLICY);
          break;

        default:
          // @ts-ignore
          navigation.push(item.route, {});
      }
    },
    [navigation],
  );

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('settings.title')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView scroll edges={[]} style={styles.safeArea}>
        <View style={[styles.listContainer, largeScreenMode && styles.cardTablet]}>
          {apps.map(item => {
            return (
              <View key={item.id.toString()}>
                <List.Subheader style={[styles.listSubHeader, { color: colors.primary }]}>{item.title}</List.Subheader>
                {item.items.map((subItem, subIndex) => {
                  return (
                    <List.Item
                      titleStyle={{ color: colors.onSurface }}
                      descriptionStyle={{ color: `${colors.onSurface}88` }}
                      key={subItem.id.toString()}
                      onPress={() => onPress(subItem, subIndex)}
                      title={subItem.title}
                      description={subItem.description}
                      left={() => (
                        <Icon
                          style={styles.listItemIcon}
                          type={subItem.iconType}
                          name={subItem.iconName}
                          color={`${colors.onSurface}88`}
                          size={24}
                        />
                      )}
                    />
                  );
                })}
                <Divider />
              </View>
            );
          })}
        </View>
      </Components.AppBaseView>
    </Components.AppBaseView>
  );
};

export default Settings;
