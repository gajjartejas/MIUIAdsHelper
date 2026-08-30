/* eslint-disable no-undef */
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map();
  return {
    getItem: jest.fn((key) => Promise.resolve(storage.get(key) ?? null)),
    setItem: jest.fn((key, value) => {
      storage.set(key, value);
      return Promise.resolve(null);
    }),
    removeItem: jest.fn((key) => {
      storage.delete(key);
      return Promise.resolve(null);
    }),
    clear: jest.fn(() => {
      storage.clear();
      return Promise.resolve(null);
    }),
  };
});
jest.mock('react-native-localize', () => require('react-native-localize/mock'));

jest.mock('react-native-mmkv', () => {
  const mmkvStorage = new Map();
  return {
    createMMKV: () => ({
      getString: (key: string) => mmkvStorage.get(key) ?? null,
      set: (key: string, value: string) => mmkvStorage.set(key, value),
      delete: (key: string) => mmkvStorage.delete(key),
      clearAll: () => mmkvStorage.clear(),
    }),
    MMKV: class {
      getString(key: string) {
        return mmkvStorage.get(key) ?? null;
      }
      set(key: string, value: string) {
        mmkvStorage.set(key, value);
      }
      delete(key: string) {
        mmkvStorage.delete(key);
      }
      clearAll() {
        mmkvStorage.clear();
      }
    },
  };
});

jest.mock('@react-native-firebase/analytics', () => {
  return {
    getAnalytics: jest.fn(),
    logScreenView: jest.fn(),
  };
});

jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(),
  recordError: jest.fn(),
  log: jest.fn(),
}));

jest.mock('react-native-iap', () => ({
  initConnection: jest.fn().mockResolvedValue(true),
  endConnection: jest.fn().mockResolvedValue(true),
  purchaseUpdatedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  purchaseErrorListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  getAvailablePurchases: jest.fn().mockResolvedValue([]),
  finishTransaction: jest.fn().mockResolvedValue(true),
  fetchProducts: jest.fn().mockResolvedValue([]),
  requestPurchase: jest.fn().mockResolvedValue(true),
  ErrorCode: {
    E_UNKNOWN: 'E_UNKNOWN',
    E_USER_CANCELLED: 'E_USER_CANCELLED',
  },
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn().mockReturnValue('1.0.0'),
  getBuildNumber: jest.fn().mockReturnValue('1'),
  getSystemVersion: jest.fn().mockReturnValue('14.0'),
  getModel: jest.fn().mockReturnValue('Pixel'),
}));

jest.mock('react-native-in-app-review', () => ({
  RequestInAppReview: jest.fn(),
  isAvailable: jest.fn().mockReturnValue(true),
}));

jest.mock('react-native-inappbrowser-reborn', () => ({
  open: jest.fn().mockResolvedValue({ type: 'cancel' }),
  isAvailable: jest.fn().mockResolvedValue(true),
}));

jest.mock('react-native-parsed-text', () => 'ParsedText');
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

jest.mock('@react-native-vector-icons/fontawesome6', () => 'FontAwesome6');
jest.mock('@react-native-vector-icons/material-design-icons', () => 'MaterialDesignIcons');

const { NativeModules } = require('react-native');
NativeModules.OpenSettings = {
  openNetworkSettings: jest.fn((pkg, cls, cb) => cb && cb(true)),
  openNotificationSettings: jest.fn((pkg, cb) => cb && cb(true)),
  openAppSettings: jest.fn((pkg, cb) => cb && cb(true)),
  readMIVersion: jest.fn().mockResolvedValue({ versionCode: '14.0', versionName: 'V14.0.0' }),
};

