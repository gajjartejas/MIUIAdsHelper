import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import analytics from 'app/services/analytics';
import { IAdsActivity, IAdsSettingAppType } from 'app/components/AdsListItem';

const { OpenSettings } = NativeModules;

export interface IDeviceMetadata {
  deviceId: string;
  brand: string;
  model: string;
  systemVersion: string;
  miuiVersion: string;
}

let cachedDeviceMetadata: IDeviceMetadata | null = null;
let lastReportedSignature: string | null = null;

export const getDeviceMetadata = async (): Promise<IDeviceMetadata> => {
  if (cachedDeviceMetadata) {
    return cachedDeviceMetadata;
  }

  let deviceId = 'unknown';
  try {
    deviceId = await DeviceInfo.getUniqueId();
  } catch (e) {
    console.warn('activityAnalytics: error getting unique ID', e);
  }

  let brand = 'unknown';
  let model = 'unknown';
  let systemVersion = 'unknown';
  try {
    brand = DeviceInfo.getBrand();
    model = await DeviceInfo.getDevice();
    systemVersion = DeviceInfo.getSystemVersion();
  } catch (e) {
    console.warn('activityAnalytics: error getting device info', e);
  }

  let miuiVersion = 'unknown';
  try {
    if (OpenSettings?.readMIVersion) {
      const miData = await OpenSettings.readMIVersion();
      if (miData?.versionName || miData?.versionCode) {
        miuiVersion = `${miData.versionName || ''} (${miData.versionCode || ''})`.trim();
      }
    }
  } catch (e) {
    console.warn('activityAnalytics: error reading MI version', e);
  }

  cachedDeviceMetadata = {
    deviceId,
    brand,
    model,
    systemVersion,
    miuiVersion,
  };

  return cachedDeviceMetadata;
};

/**
 * Truncates comma-separated string safely under GA4 100 character limit
 */
const formatSafeParamString = (items: (string | number)[], maxLen = 100): string => {
  let result = '';
  for (let i = 0; i < items.length; i++) {
    const itemStr = String(items[i]);
    const nextStr = result ? `${result},${itemStr}` : itemStr;
    if (nextStr.length > maxLen) {
      break;
    }
    result = nextStr;
  }
  return result;
};

/**
 * Reports complete installed vs not-installed activity inventory to Firebase/Google Analytics
 */
export const reportDeviceActivityInventory = async (
  entries: IAdsActivity[],
  availabilityMap: Record<number, boolean>,
  forceRefresh = false,
): Promise<void> => {
  if (!entries || entries.length === 0 || !availabilityMap) {
    return;
  }

  // Create signature to prevent duplicate spam within the same session
  const availabilityEntries = Object.entries(availabilityMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([id, val]) => `${id}:${val ? 1 : 0}`)
    .join('|');

  if (!forceRefresh && lastReportedSignature === availabilityEntries) {
    return;
  }
  lastReportedSignature = availabilityEntries;

  try {
    const meta = await getDeviceMetadata();
    const tracker = analytics();

    // 1. Set global user ID & User Properties
    if (meta.deviceId && meta.deviceId !== 'unknown') {
      await tracker.setUserId(meta.deviceId);
    }

    const installedEntries: IAdsActivity[] = [];
    const notInstalledEntries: IAdsActivity[] = [];

    entries.forEach(entry => {
      const isInstalled = availabilityMap[entry.id] !== undefined ? Boolean(availabilityMap[entry.id]) : true;
      if (isInstalled) {
        installedEntries.push(entry);
      } else {
        notInstalledEntries.push(entry);
      }
    });

    const totalCount = entries.length;
    const installedCount = installedEntries.length;
    const notInstalledCount = notInstalledEntries.length;
    const installedPct = totalCount > 0 ? Number(((installedCount / totalCount) * 100).toFixed(1)) : 0;

    await tracker.setUserProperties({
      device_id: meta.deviceId.slice(0, 36),
      device_brand: meta.brand.slice(0, 36),
      device_model: meta.model.slice(0, 36),
      miui_version: meta.miuiVersion.slice(0, 36),
      installed_count: String(installedCount),
      not_installed_count: String(notInstalledCount),
    });

    // 2. Log summary event: device_activity_inventory
    const installedIds = installedEntries.map(e => e.id);
    const notInstalledIds = notInstalledEntries.map(e => e.id);

    await tracker.logEvent('device_activity_inventory', {
      device_id: meta.deviceId,
      device_brand: meta.brand,
      device_model: meta.model,
      miui_version: meta.miuiVersion,
      total_activities: totalCount,
      installed_count: installedCount,
      not_installed_count: notInstalledCount,
      installed_pct: installedPct,
      installed_ids: formatSafeParamString(installedIds),
      not_installed_ids: formatSafeParamString(notInstalledIds),
    });

    const formatCategoryName = (type: IAdsSettingAppType | string): string => {
      switch (type) {
        case IAdsSettingAppType.AudioVideo:
        case 'home.audio_video':
          return 'AudioVideo';
        case IAdsSettingAppType.ThemeLockScreen:
        case 'home.theme_lock_screen':
          return 'ThemeLockScreen';
        case IAdsSettingAppType.Internet:
        case 'home.internet':
          return 'Internet';
        case IAdsSettingAppType.Utilities:
        case 'home.utilities':
          return 'Utilities';
        case IAdsSettingAppType.Security:
        case 'home.security':
          return 'Security';
        case IAdsSettingAppType.System:
        case 'home.type_system':
          return 'System';
        case IAdsSettingAppType.DisableEnable:
        case 'home.type_disable_enable':
          return 'DisableEnable';
        default:
          return String(type)
            .replace(/^home\./, '')
            .replace(/_/g, ' ');
      }
    };

    // 3. Log categorized breakdown events: activity_category_status
    const categoryGroups: Record<string, { installed: string[]; missing: string[] }> = {};

    entries.forEach(entry => {
      const category = formatCategoryName(entry.appType || 'Other');
      if (!categoryGroups[category]) {
        categoryGroups[category] = { installed: [], missing: [] };
      }
      const appLabel = entry.appname || entry.title;
      const isInstalled = availabilityMap[entry.id] !== undefined ? Boolean(availabilityMap[entry.id]) : true;

      if (isInstalled) {
        categoryGroups[category].installed.push(appLabel);
      } else {
        categoryGroups[category].missing.push(appLabel);
      }
    });

    for (const [category, group] of Object.entries(categoryGroups)) {
      await tracker.logEvent('activity_category_status', {
        device_id: meta.deviceId,
        category: category,
        category_installed_count: group.installed.length,
        category_missing_count: group.missing.length,
        installed_apps: formatSafeParamString(group.installed),
        missing_apps: formatSafeParamString(group.missing),
      });
    }
  } catch (e) {
    console.warn('activityAnalytics: error reporting inventory', e);
  }
};

/**
 * Logs individual activity view status
 */
export const logActivityDetailView = async (item: IAdsActivity, isInstalled: boolean): Promise<void> => {
  try {
    const meta = await getDeviceMetadata();
    const tracker = analytics();
    const primaryPackage = item.adsSettingPaths?.[0]?.package || 'unknown';

    await tracker.logEvent('activity_item_status', {
      device_id: meta.deviceId,
      activity_id: item.id,
      activity_name: item.appname || item.title,
      primary_package: primaryPackage,
      is_installed: isInstalled ? 'true' : 'false',
    });
  } catch (e) {
    console.warn('activityAnalytics: error logging detail view', e);
  }
};

export default {
  getDeviceMetadata,
  reportDeviceActivityInventory,
  logActivityDetailView,
};
