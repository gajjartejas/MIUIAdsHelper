import { NativeModules, Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { SUPPORTED_LANGUAGES } from 'app/locales';

const getOpenSettings = () => NativeModules?.OpenSettings;

export const CODE_TO_BCP47: Record<string, string> = {
  pt_br: 'pt-BR',
  zh_cn: 'zh-CN',
};

export const BCP47_TO_CODE: Record<string, string> = {
  'pt-br': 'pt_br',
  pt_br: 'pt_br',
  'zh-cn': 'zh_cn',
  zh_cn: 'zh_cn',
  'zh-hans': 'zh_cn',
  'zh-hans-cn': 'zh_cn',
  'zh-sg': 'zh_cn',
};

/**
 * Normalizes an internal app language code into an Android BCP-47 language tag.
 */
export const toBcp47Tag = (code: string): string => {
  const normalized = (code || '').toLowerCase().trim();
  if (CODE_TO_BCP47[normalized]) {
    return CODE_TO_BCP47[normalized];
  }
  return normalized.replace('_', '-');
};

/**
 * Normalizes an Android BCP-47 language tag into an internal app language code.
 */
export const fromBcp47Tag = (tag: string): string | null => {
  if (!tag) return null;
  const normalized = tag.toLowerCase().trim().replace('_', '-');

  if (BCP47_TO_CODE[normalized]) {
    return BCP47_TO_CODE[normalized];
  }

  // Exact code match
  const exact = SUPPORTED_LANGUAGES.find(v => v.code.toLowerCase() === normalized.replace('-', '_'));
  if (exact) return exact.code;

  // Primary subtag match (e.g. "es-ES" -> "es", "fr-FR" -> "fr")
  const subtag = normalized.split('-')[0];
  if (subtag === 'zh') return 'zh_cn';
  const subtagMatch = SUPPORTED_LANGUAGES.find(v => v.code.toLowerCase() === subtag);
  if (subtagMatch) return subtagMatch.code;

  return null;
};

/**
 * Determines whether native per-app language settings are supported.
 * Available on Android 13+ (API 33+).
 */
export const isPerAppLanguageSupported = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  try {
    const openSettings = getOpenSettings();
    if (openSettings && typeof openSettings.isPerAppLanguageSupported === 'function') {
      return await openSettings.isPerAppLanguageSupported();
    }
    const version = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10);
    return !Number.isNaN(version) && version >= 33;
  } catch {
    return false;
  }
};

/**
 * Retrieves the application locale configured in Android 13+ per-app language preferences.
 */
export const getNativeApplicationLocale = async (): Promise<string | null> => {
  const openSettings = getOpenSettings();
  if (Platform.OS !== 'android' || !openSettings || typeof openSettings.getApplicationLocales !== 'function') {
    return null;
  }
  try {
    const rawTag: string = await openSettings.getApplicationLocales();
    if (!rawTag) return null;
    const primaryTag = rawTag.split(',')[0]?.trim();
    return fromBcp47Tag(primaryTag);
  } catch {
    return null;
  }
};

/**
 * Synchronizes the app language to Android 13+ system settings via LocaleManager.
 */
export const setNativeApplicationLocale = async (code: string): Promise<boolean> => {
  const openSettings = getOpenSettings();
  if (Platform.OS !== 'android' || !openSettings || typeof openSettings.setApplicationLocales !== 'function') {
    return false;
  }
  try {
    const tag = toBcp47Tag(code);
    return await openSettings.setApplicationLocales(tag);
  } catch {
    return false;
  }
};

/**
 * Launches Android 13+ system per-app language settings.
 */
export const openNativeAppLanguageSettings = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  try {
    const openSettings = getOpenSettings();
    if (openSettings && typeof openSettings.openAppLanguageSettings === 'function') {
      const opened = await openSettings.openAppLanguageSettings();
      if (opened) return true;
    }
    if (typeof RNLocalize.openAppLanguageSettings === 'function') {
      await RNLocalize.openAppLanguageSettings();
      return true;
    }
  } catch {
    // Unsupported or failed
  }
  return false;
};
