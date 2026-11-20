import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';
import * as RNLocalize from 'react-native-localize';
import { SUPPORTED_LANGUAGES } from 'app/locales';

interface IAppLangConfigState {
  selectedLanguageCode: string;
  selectedLanguageName: string;
}

interface IAppLangConfigActions {
  setSelectedLanguageCode: (code: string) => void;
}

const resolveDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (!locales || locales.length === 0) {
    return SUPPORTED_LANGUAGES[0];
  }
  const primary = locales[0];
  const langCode = (primary.languageCode || '').toLowerCase();
  const countryCode = (primary.countryCode || '').toLowerCase();
  const langTag = (primary.languageTag || '').toLowerCase().replace('-', '_');

  // Match full tag or combined language_country (e.g., pt_br, zh_cn)
  const matchTag =
    SUPPORTED_LANGUAGES.find(v => v.code.toLowerCase() === langTag) ||
    (countryCode ? SUPPORTED_LANGUAGES.find(v => v.code.toLowerCase() === `${langCode}_${countryCode}`) : undefined);
  if (matchTag) {
    return matchTag;
  }

  // Match base language code (e.g., ar, de, es, fr, hi, id, it, ja, ko, nl, no, pl, pt, ro, ru, sk, tr, uk, vi)
  const matchCode = SUPPORTED_LANGUAGES.find(v => v.code.toLowerCase() === langCode);
  if (matchCode) {
    return matchCode;
  }

  // Fallback for Chinese variants
  if (langCode === 'zh') {
    const zhMatch = SUPPORTED_LANGUAGES.find(v => v.code === 'zh_cn');
    if (zhMatch) return zhMatch;
  }

  return SUPPORTED_LANGUAGES[0];
};

const defaultLanguage = resolveDeviceLanguage();

const initialState: IAppLangConfigState = {
  selectedLanguageCode: defaultLanguage.code,
  selectedLanguageName: defaultLanguage.language,
};

const useAppLangConfigStore = create<IAppLangConfigState & IAppLangConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setSelectedLanguageCode: (value: string) =>
          set(() => {
            const found = SUPPORTED_LANGUAGES.find(v => v.code === value) || SUPPORTED_LANGUAGES[0];
            return {
              selectedLanguageCode: found.code,
              selectedLanguageName: found.language,
            };
          }),
      }),
      {
        name: 'app-lang-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppLangConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppLangConfigStore;
