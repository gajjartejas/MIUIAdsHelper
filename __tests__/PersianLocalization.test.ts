import i18n, { SUPPORTED_LANGUAGES } from '../app/locales';
import useAppLangConfigStore from '../app/store/appLangConfig';
import english from '../app/locales/en.json';
import persian from '../app/locales/fa.json';

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'fa', languageTag: 'fa-IR', isRTL: true }],
}));

const flatten = (value: object, prefix = ''): Record<string, string> =>
  Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) =>
      typeof entry === 'string' ? [[`${prefix}${key}`, entry]] : Object.entries(flatten(entry, `${prefix}${key}.`)),
    ),
  );

test('Persian covers every English key and preserves interpolation and guide formatting', () => {
  const source = flatten(english);
  const translation = flatten(persian);
  expect(Object.keys(translation).sort()).toEqual(Object.keys(source).sort());
  for (const [key, value] of Object.entries(translation)) {
    expect(value.trim()).not.toBe('');
    expect((value.match(/{{[^}]+}}/g) ?? []).sort()).toEqual((source[key].match(/{{[^}]+}}/g) ?? []).sort());
    expect((value.match(/\*\*/g) ?? []).length % 2).toBe(0);
    if (/^ads_step_\d+_steps$/.test(key)) expect(value).toContain('\n');
  }
});

test('Persian devices start in Persian and expose it in the language picker', () => {
  const language = SUPPORTED_LANGUAGES.find(item => item.code === 'fa');
  expect(language?.language).toContain('فارسی');
  expect(language?.icon).toBeDefined();
  expect(useAppLangConfigStore.getState().selectedLanguageCode).toBe('fa');
  expect(i18n.language).toBe('fa');
});

test('Persian regional variants resolve translated copy and interpolate values', async () => {
  await i18n.changeLanguage('fa-IR');
  expect(i18n.t('general.close')).toBe(persian.general.close);
  expect(i18n.t('about.version', { id0001: '3.0.0' })).toBe('نسخه: 3.0.0');
  expect(i18n.t('iap_pending')).toBe(persian.iap_pending);
  expect(i18n.t('ads_step_19_steps')).toBe(persian.ads_step_19_steps);
});

test('unsupported languages still fall back to English', async () => {
  await i18n.changeLanguage('zz');
  expect(i18n.t('general.close')).toBe(english.general.close);
});
