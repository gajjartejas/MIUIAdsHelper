import fs from 'fs';
import path from 'path';
import { NativeModules, Platform } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { SUPPORTED_LANGUAGES } from '../app/locales';
import {
  fromBcp47Tag,
  getNativeApplicationLocale,
  isPerAppLanguageSupported,
  openNativeAppLanguageSettings,
  setNativeApplicationLocale,
  toBcp47Tag,
} from '../app/services/perAppLanguage';

describe('Android 13+ Per-App Language Preferences & Locales Config', () => {
  const localesConfigPath = path.join(
    __dirname,
    '../android/app/src/main/res/xml/locales_config.xml',
  );
  const manifestPath = path.join(
    __dirname,
    '../android/app/src/main/AndroidManifest.xml',
  );

  test('locales_config.xml exists and declares all 30 supported languages in BCP-47 format', () => {
    expect(fs.existsSync(localesConfigPath)).toBe(true);
    const content = fs.readFileSync(localesConfigPath, 'utf8');

    // Extract all <locale android:name="..." />
    const matches = Array.from(content.matchAll(/<locale\s+android:name="([^"]+)"/g)).map(
      m => m[1],
    );

    expect(matches.length).toBe(30);

    for (const item of SUPPORTED_LANGUAGES) {
      const expectedTag = toBcp47Tag(item.code);
      expect(matches).toContain(expectedTag);
    }
  });

  test('AndroidManifest.xml declares android:localeConfig="@xml/locales_config"', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = fs.readFileSync(manifestPath, 'utf8');
    expect(manifest).toContain('android:localeConfig="@xml/locales_config"');
  });

  describe('BCP-47 <-> Internal Code Tag Mapping', () => {
    test('maps internal codes to BCP-47 tags', () => {
      expect(toBcp47Tag('en')).toBe('en');
      expect(toBcp47Tag('pt_br')).toBe('pt-BR');
      expect(toBcp47Tag('zh_cn')).toBe('zh-CN');
      expect(toBcp47Tag('es')).toBe('es');
      expect(toBcp47Tag('de')).toBe('de');
      expect(toBcp47Tag('ar')).toBe('ar');
    });

    test('maps BCP-47 tags back to internal codes', () => {
      expect(fromBcp47Tag('en')).toBe('en');
      expect(fromBcp47Tag('pt-BR')).toBe('pt_br');
      expect(fromBcp47Tag('pt_BR')).toBe('pt_br');
      expect(fromBcp47Tag('zh-CN')).toBe('zh_cn');
      expect(fromBcp47Tag('zh-Hans')).toBe('zh_cn');
      expect(fromBcp47Tag('es-ES')).toBe('es');
      expect(fromBcp47Tag('de-DE')).toBe('de');
      expect(fromBcp47Tag('fr-CA')).toBe('fr');
      expect(fromBcp47Tag('unknown-tag')).toBeNull();
      expect(fromBcp47Tag('')).toBeNull();
    });
  });

  describe('Native OpenSettings module interaction', () => {
    const originalOpenSettings = NativeModules.OpenSettings;
    const originalPlatform = Platform.OS;
    const originalVersion = Platform.Version;

    afterEach(() => {
      NativeModules.OpenSettings = originalOpenSettings;
      Platform.OS = originalPlatform;
      (Platform as { Version: unknown }).Version = originalVersion;
      jest.clearAllMocks();
    });

    test('isPerAppLanguageSupported returns true on Android 13+ (API 33+)', async () => {
      Platform.OS = 'android';
      NativeModules.OpenSettings = {
        isPerAppLanguageSupported: jest.fn().mockResolvedValue(true),
      };

      const supported = await isPerAppLanguageSupported();
      expect(supported).toBe(true);
      expect(NativeModules.OpenSettings.isPerAppLanguageSupported).toHaveBeenCalled();
    });

    test('isPerAppLanguageSupported returns false on non-Android platforms', async () => {
      Platform.OS = 'ios';
      const supported = await isPerAppLanguageSupported();
      expect(supported).toBe(false);
    });

    test('getNativeApplicationLocale resolves and maps locale tag from OpenSettings', async () => {
      Platform.OS = 'android';
      NativeModules.OpenSettings = {
        getApplicationLocales: jest.fn().mockResolvedValue('pt-BR,en'),
      };

      const locale = await getNativeApplicationLocale();
      expect(locale).toBe('pt_br');
    });

    test('getNativeApplicationLocale returns null when no locales set', async () => {
      Platform.OS = 'android';
      NativeModules.OpenSettings = {
        getApplicationLocales: jest.fn().mockResolvedValue(''),
      };

      const locale = await getNativeApplicationLocale();
      expect(locale).toBeNull();
    });

    test('setNativeApplicationLocale sends normalized BCP-47 tag to OpenSettings', async () => {
      Platform.OS = 'android';
      const mockSet = jest.fn().mockResolvedValue(true);
      NativeModules.OpenSettings = {
        setApplicationLocales: mockSet,
      };

      const result = await setNativeApplicationLocale('pt_br');
      expect(result).toBe(true);
      expect(mockSet).toHaveBeenCalledWith('pt-BR');
    });

    test('openNativeAppLanguageSettings delegates to OpenSettings or RNLocalize', async () => {
      Platform.OS = 'android';
      const mockOpen = jest.fn().mockResolvedValue(true);
      NativeModules.OpenSettings = {
        openAppLanguageSettings: mockOpen,
      };

      const result = await openNativeAppLanguageSettings();
      expect(result).toBe(true);
      expect(mockOpen).toHaveBeenCalled();
    });

    test('openNativeAppLanguageSettings falls back to RNLocalize when OpenSettings unavailable', async () => {
      Platform.OS = 'android';
      NativeModules.OpenSettings = {};
      const spy = jest.spyOn(RNLocalize, 'openAppLanguageSettings').mockResolvedValue(undefined);

      const result = await openNativeAppLanguageSettings();
      expect(result).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});
