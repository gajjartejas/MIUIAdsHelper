//ThirdParty
import { IAdsActivity, IAdsActivitySection, IAdsSettingAppType } from 'app/components/AdsListItem';
import { useTranslation } from 'react-i18next';

const useGetSettingActivities = (): { entries: IAdsActivity[]; groupedEntries: IAdsActivitySection[] } => {
  //Constants
  const { t } = useTranslation();

  let entries: IAdsActivity[] = [
    {
      id: 1,
      appname: t('ads_step_0_appname'),
      title: t('ads_step_0_title'),
      subtitle: t('ads_step_0_subtitle'),
      detail: t('ads_step_0_detail'),
      steps: t('ads_step_0_steps'),
      specialNote: t('ads_step_0_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.player',
          activity: 'com.miui.player.phone.ui.MusicSettings',
        },
        {
          package: 'com.miui.player',
          activity: 'com.miui.player.ui.MusicBrowserActivity',
        },
      ],
      iconBackgroundColor: '#FF2284',
      iconName: 'music',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 2,
      appname: t('ads_step_1_appname'),
      title: t('ads_step_1_title'),
      subtitle: t('ads_step_1_subtitle'),
      detail: t('ads_step_1_detail'),
      steps: t('ads_step_1_steps'),
      specialNote: t('ads_step_1_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.videoplayer',
          activity: 'com.miui.video.onlinevideo.feature.setting.SettingActivity',
        },
        {
          package: 'com.miui.videoplayer',
          activity: 'com.miui.video.global.activity.SettingActivity',
        },
      ],
      iconBackgroundColor: '#E83F63',
      iconName: 'play-circle',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 3,
      appname: t('ads_step_2_appname'),
      title: t('ads_step_2_title'),
      subtitle: t('ads_step_2_subtitle'),
      detail: t('ads_step_2_detail'),
      steps: t('ads_step_2_steps'),
      specialNote: t('ads_step_2_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.thememanager',
          activity: 'com.android.thememanager.ThemeResourceTabActivity',
        },
        {
          package: 'com.android.thememanager',
          activity: 'com.android.thememanager.activity.ThemeResourcesTabActivity',
        },
      ],
      iconBackgroundColor: '#009DCC',
      iconName: 'color-lens',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 4,
      appname: t('ads_step_3_appname'),
      title: t('ads_step_3_title'),
      subtitle: t('ads_step_3_subtitle'),
      detail: t('ads_step_3_detail'),
      steps: t('ads_step_3_steps'),
      specialNote: t('ads_step_3_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.mi.android.globalFileexplorer',
          activity: 'com.android.fileexplorer.FileExplorerTabActivity',
        },
        {
          package: 'com.mi.android.globalFileexplorer',
          activity: 'com.android.fileexplorer.activity.SettingPreferenceActivity',
        },
      ],
      iconBackgroundColor: '#FCB536',
      iconName: 'folder',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 5,
      appname: t('ads_step_4_appname'),
      title: t('ads_step_4_title'),
      subtitle: t('ads_step_4_subtitle'),
      detail: t('ads_step_4_detail'),
      steps: t('ads_step_4_steps'),
      specialNote: t('ads_step_4_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.browser',
          activity: 'com.android.browser.BrowserSettingsActivity',
        },
      ],
      iconBackgroundColor: '#2399E3',
      iconName: 'globe',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 6,
      appname: t('ads_step_5_appname'),
      title: t('ads_step_5_title'),
      subtitle: t('ads_step_5_subtitle'),
      detail: t('ads_step_5_detail'),
      steps: t('ads_step_5_steps'),
      specialNote: t('ads_step_5_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.providers.downloads.ui',
          activity: 'com.android.providers.downloads.ui.DownloadList',
        },
        {
          package: 'com.android.providers.downloads.ui',
          activity: 'com.android.providers.downloads.ui.activity.InterSettingActivity',
        },
      ],
      iconBackgroundColor: '#FF6827',
      iconName: 'download',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 7,
      appname: t('ads_step_6_appname'),
      title: t('ads_step_6_title'),
      subtitle: t('ads_step_6_subtitle'),
      detail: t('ads_step_6_detail'),
      steps: t('ads_step_6_steps'),
      specialNote: t('ads_step_6_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.securitycenter',
          activity: 'com.miui.securityscan.ui.settings.SettingsActivity',
        },
      ],
      iconBackgroundColor: '#00D59D',
      iconName: 'security',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 8,
      appname: t('ads_step_7_appname'),
      title: t('ads_step_7_title'),
      subtitle: t('ads_step_7_subtitle'),
      detail: t('ads_step_7_detail'),
      steps: t('ads_step_7_steps'),
      specialNote: t('ads_step_7_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.cleaner',
          activity: 'com.miui.optimizecenter.settings.SettingsActivity',
        },
        {
          package: 'com.miui.cleanmaster',
          activity: 'com.miui.optimizecenter.settings.SettingsActivity',
        },
      ],
      iconBackgroundColor: '#E89736',
      iconName: 'trash',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 9,
      appname: t('ads_step_8_appname'),
      title: t('ads_step_8_title'),
      subtitle: t('ads_step_8_subtitle'),
      detail: t('ads_step_8_detail'),
      steps: t('ads_step_8_steps'),
      specialNote: t('ads_step_8_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.securitycenter',
          activity: 'com.miui.applicationlock.PrivacyAndAppLockManageActivity',
        },
        {
          package: 'com.miui.securitycenter',
          activity: 'com.miui.securityscan.MainActivity',
        },
      ],
      iconBackgroundColor: '#00B17D',
      iconName: 'lock',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 10,
      appname: t('ads_step_9_appname'),
      title: t('ads_step_9_title'),
      subtitle: t('ads_step_9_subtitle'),
      detail: t('ads_step_9_detail'),
      steps: t('ads_step_9_steps'),
      specialNote: t('ads_step_9_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.securitycenter',
          activity: 'com.miui.optimizemanage.OptimizemanageMainActivity',
        },
      ],
      iconBackgroundColor: '#5062EC',
      iconName: 'speedometer',
      iconFamily: 'ionicon',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 11,
      appname: t('ads_step_10_appname'),
      title: t('ads_step_10_title'),
      subtitle: t('ads_step_10_subtitle'),
      detail: t('ads_step_10_detail'),
      steps: t('ads_step_10_steps'),
      specialNote: t('ads_step_10_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.securitycenter',
          activity: 'com.miui.appmanager.AppManagerMainActivity',
        },
      ],
      iconBackgroundColor: '#FACE59',
      iconName: 'apps',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
    {
      id: 12,
      appname: t('ads_step_11_appname'),
      title: t('ads_step_11_title'),
      subtitle: t('ads_step_11_subtitle'),
      detail: t('ads_step_11_detail'),
      steps: t('ads_step_11_steps'),
      specialNote: t('ads_step_11_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.settings',
          activity: 'com.android.settings.privacy.PrivacyRevocationSettings',
        },
        {
          package: 'com.android.settings',
          activity: 'com.android.settings.MiuiSettings',
        },
      ],
      iconBackgroundColor: '#FF2781',
      iconName: 'android',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 13,
      appname: t('ads_step_12_appname'),
      title: t('ads_step_12_title'),
      subtitle: t('ads_step_12_subtitle'),
      detail: t('ads_step_12_detail'),
      steps: t('ads_step_12_steps'),
      specialNote: t('ads_step_12_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.settings',
          activity: 'com.android.settings.ad.AdServiceSettings',
        },
      ],
      iconBackgroundColor: '#5062EC',
      iconName: 'adversal',
      iconFamily: 'font-awesome5',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 14,
      appname: t('ads_step_13_appname'),
      title: t('ads_step_13_title'),
      subtitle: t('ads_step_13_subtitle'),
      detail: t('ads_step_13_detail'),
      steps: t('ads_step_13_steps'),
      specialNote: t('ads_step_13_specialNote'),
      adsSettingPaths: [
        {
          package: null,
          activity: null,
        },
      ],
      iconBackgroundColor: '#5E6883',
      iconName: 'apps',
      iconFamily: 'material',
      hideButton: true,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 15,
      appname: t('ads_step_14_appname'),
      title: t('ads_step_14_title'),
      subtitle: t('ads_step_14_subtitle'),
      detail: t('ads_step_14_detail'),
      steps: t('ads_step_14_steps'),
      specialNote: t('ads_step_14_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.home',
          activity: 'com.miui.home.settings.MiuiHomeSettingActivity',
        },
      ],
      iconBackgroundColor: '#00659D',
      iconName: 'clear-all',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 16,
      appname: t('ads_step_15_appname'),
      title: t('ads_step_15_title'),
      subtitle: t('ads_step_15_subtitle'),
      detail: t('ads_step_15_detail'),
      steps: t('ads_step_15_steps'),
      specialNote: t('ads_step_15_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.settings',
          activity: 'com.android.settings.Settings$PrivacyDashboardActivity',
        },
      ],
      iconBackgroundColor: '#4285f4',
      iconName: 'google',
      iconFamily: 'font-awesome',
      hideButton: false,
      appType: IAdsSettingAppType.Other,
    },
    {
      id: 17,
      appname: t('ads_step_16_appname'),
      title: t('ads_step_16_title'),
      subtitle: t('ads_step_16_subtitle'),
      detail: t('ads_step_16_detail'),
      steps: t('ads_step_16_steps'),
      specialNote: t('ads_step_16_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.android.settings',
          activity: 'com.android.settings.Settings$SecurityDashboardActivity',
        },
      ],
      iconBackgroundColor: '#E89736',
      iconName: 'person',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 18,
      appname: t('ads_step_17_appname'),
      title: t('ads_step_17_title'),
      subtitle: t('ads_step_17_subtitle'),
      detail: t('ads_step_17_detail'),
      steps: t('ads_step_17_steps'),
      specialNote: t('ads_step_17_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.miui.android.fashiongallery',
          activity: 'com.miui.android.fashiongallery.setting.SettingActivity',
        },
      ],
      iconBackgroundColor: '#018700',
      iconName: 'screen-lock-portrait',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 19,
      appname: t('ads_step_18_appname'),
      title: t('ads_step_18_title'),
      subtitle: t('ads_step_18_subtitle'),
      detail: t('ads_step_18_detail'),
      steps: t('ads_step_18_steps'),
      specialNote: t('ads_step_18_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.mi.globalminusscreen',
          activity: 'com.mi.globalminusscreen.settings.PASettingActivity',
        },
      ],
      iconBackgroundColor: '#d50000',
      iconName: 'widgets',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    },
    {
      id: 20,
      appname: t('ads_step_19_appname'),
      title: t('ads_step_19_title'),
      subtitle: t('ads_step_19_subtitle'),
      detail: t('ads_step_19_detail'),
      steps: t('ads_step_19_steps'),
      specialNote: t('ads_step_19_specialNote'),
      adsSettingPaths: [
        {
          package: 'com.xiaomi.midrop',
          activity: 'com.xiaomi.midrop.SplashScreen',
        },
      ],
      iconBackgroundColor: '#536DFE',
      iconName: 'share-alt-square',
      iconFamily: 'font-awesome5',
      hideButton: false,
      appType: IAdsSettingAppType.Standard,
    },
  ];

  const groupBy = (xs: any, key: string) => {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  let res = groupBy(entries, 'appType');

  let groupedEntries = Object.keys(res).map((key, _index) => {
    return { title: key, data: res[key] } as IAdsActivitySection;
  });

  return { entries, groupedEntries };
};

export default useGetSettingActivities;
