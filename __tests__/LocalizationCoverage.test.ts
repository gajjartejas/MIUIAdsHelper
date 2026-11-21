import fs from 'fs';
import path from 'path';
import i18n, { SUPPORTED_LANGUAGES } from '../app/locales';
import useAppLangConfigStore from '../app/store/appLangConfig';
import english from '../app/locales/en.json';

const flatten = (value: object, prefix = ''): Record<string, string> =>
  Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) =>
      typeof entry === 'string' ? [[`${prefix}${key}`, entry]] : Object.entries(flatten(entry, `${prefix}${key}.`)),
    ),
  );

const source = flatten(english);
const sourceKeys = Object.keys(source).sort();

describe('Localization Coverage & Consistency for all supported languages', () => {
  test('all 31 supported languages are properly registered in SUPPORTED_LANGUAGES', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(31);
    const codes = SUPPORTED_LANGUAGES.map(item => item.code);
    expect(new Set(codes).size).toBe(31);
    for (const item of SUPPORTED_LANGUAGES) {
      expect(item.icon).toBeDefined();
      expect(item.language.trim()).not.toBe('');
      expect(item.code.trim()).not.toBe('');
    }
  });

  const localesDir = path.join(__dirname, '../app/locales');
  const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

  test('locales directory contains exactly 31 locale JSON files', () => {
    expect(localeFiles.length).toBe(31);
  });

  localeFiles.forEach(file => {
    const langCode = file.replace('.json', '');
    describe(`Locale file: ${file}`, () => {
      const filePath = path.join(localesDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(raw);
      const translation = flatten(json);

      test(`${langCode} covers every canonical English key with no extras or missing`, () => {
        expect(Object.keys(translation).sort()).toEqual(sourceKeys);
      });

      test(`${langCode} values are non-empty and preserve placeholders & markdown format`, () => {
        for (const [key, value] of Object.entries(translation)) {
          expect(value.trim()).not.toBe('');
          const expectedPlaceholders = (source[key].match(/{{[^}]+}}/g) ?? []).sort();
          const actualPlaceholders = (value.match(/{{[^}]+}}/g) ?? []).sort();
          expect(actualPlaceholders).toEqual(expectedPlaceholders);
          expect((value.match(/\*\*/g) ?? []).length % 2).toBe(0);
          if (/^ads_step_\d+_steps$/.test(key)) {
            expect(value).toContain('\n');
          }
        }
      });
    });
  });

  test('i18n can switch between newly added languages and resolve translations', async () => {
    for (const item of SUPPORTED_LANGUAGES) {
      await i18n.changeLanguage(item.code);
      const closeText = i18n.t('general.close');
      expect(closeText.trim()).not.toBe('');
      const versionText = i18n.t('about.version', { id0001: '3.0.0' });
      expect(versionText).toContain('3.0.0');
    }
  });

  test('regional codes resolve smoothly', async () => {
    await i18n.changeLanguage('pt-BR');
    expect(i18n.t('about.moreApps')).toBe('Mais aplicativos');

    await i18n.changeLanguage('zh-CN');
    expect(i18n.t('general.close')).toBe('关闭');

    await i18n.changeLanguage('ar-EG');
    expect(i18n.t('general.close')).toBe('إغلاق');

    await i18n.changeLanguage('bn');
    expect(i18n.t('general.close')).toBe('বন্ধ করুন');

    await i18n.changeLanguage('bn-BD');
    expect(i18n.t('general.close')).toBe('বন্ধ করুন');
  });

  test('unsupported locale falls back to English', async () => {
    await i18n.changeLanguage('unknown_LANG');
    expect(i18n.t('general.close')).toBe(english.general.close);
  });

  test('useAppLangConfigStore accurately updates selected language', () => {
    useAppLangConfigStore.getState().setSelectedLanguageCode('zh_cn');
    expect(useAppLangConfigStore.getState().selectedLanguageCode).toBe('zh_cn');
    expect(useAppLangConfigStore.getState().selectedLanguageName).toContain('简体中文');

    useAppLangConfigStore.getState().setSelectedLanguageCode('ar');
    expect(useAppLangConfigStore.getState().selectedLanguageCode).toBe('ar');
    expect(useAppLangConfigStore.getState().selectedLanguageName).toContain('العربية');
  });
});
