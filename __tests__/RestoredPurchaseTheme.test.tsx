import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Appearance, StatusBar } from 'react-native';
import { getAvailablePurchases, Purchase } from 'react-native-iap';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppManager from '../app/components/AppManager';
import RootNavigation from '../app/navigation/NavigationStack';
import Loading from '../app/screens/Loading';
import useAppConfigStore from '../app/store/appConfig';
import useThemeConfigStore, { IAppearanceType } from '../app/store/themeConfig';

jest.mock('../app/navigation/HomeTabNavigator', () => () => null);
jest.mock('../app/components', () => ({ __esModule: true, default: { CommonDialog: () => null } }));
jest.mock('../app/utils', () => ({
  __esModule: true,
  default: { rateApp: { rateAppIfNeeded: jest.fn().mockResolvedValue(undefined) } },
}));
jest.mock('../app/services/billing', () => ({ connectBilling: jest.fn().mockResolvedValue(undefined) }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const ReactModule = require('react');
  return {
    ...actual,
    Provider: (props: { children: React.ReactNode }) => ReactModule.createElement('Paper', props, props.children),
  };
});
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const ReactModule = require('react');
  return {
    ...actual,
    NavigationContainer: ReactModule.forwardRef((props: { children: React.ReactNode }, _ref: unknown) =>
      ReactModule.createElement('Navigation', props, props.children),
    ),
  };
});
jest.mock('@react-navigation/native-stack', () => {
  const ReactModule = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) =>
        ReactModule.createElement(ReactModule.Fragment, null, children),
      Screen: () => null,
    }),
  };
});

const query = jest.mocked(getAvailablePurchases);
const restoredPurchase = {
  productId: 'com.tejasgajjar.miuiadshelper.item1',
  purchaseState: 'purchased',
  isAcknowledgedAndroid: true,
} as Purchase;
let rendered: Renderer.ReactTestRenderer;
let restore: (purchases: Purchase[]) => void;
let appearanceChanged: (preferences: Appearance.AppearancePreferences) => void;
const replace = jest.fn();
type LoadingProps = React.ComponentProps<typeof Loading>;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('dark');
  jest.spyOn(Appearance, 'addChangeListener').mockImplementation(listener => {
    appearanceChanged = listener;
    return { remove: jest.fn() };
  });
  useAppConfigStore.setState({ purchased: false });
  useThemeConfigStore.getState().setAppearance(IAppearanceType.Auto);
  query.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        restore = resolve;
      }),
  );
});
afterEach(async () => {
  if (rendered) await act(async () => rendered.unmount());
  jest.restoreAllMocks();
});

const mount = async () => {
  await act(async () => {
    rendered = Renderer.create(
      <AppManager>
        <RootNavigation />
        <Loading
          navigation={{ replace } as unknown as LoadingProps['navigation']}
          route={{ key: 'loading', name: 'Loading' }}
        />
      </AppManager>,
    );
  });
};
const expectDark = (dark: boolean) => {
  expect(rendered.root.findByType(PaperProvider).props.theme.dark).toBe(dark);
  expect(rendered.root.findByType(NavigationContainer).props.theme.dark).toBe(dark);
  expect(rendered.root.findByType(StatusBar).props.barStyle).toBe(dark ? 'light-content' : 'dark-content');
};

it('keeps Auto during delayed restoration after reinstall and follows the system when ownership returns', async () => {
  await mount();
  expectDark(false);
  expect(useThemeConfigStore.getState().appearance).toBe(IAppearanceType.Auto);
  await act(async () => restore([restoredPurchase]));
  expectDark(true);
  expect(useThemeConfigStore.getState().appearance).toBe(IAppearanceType.Auto);
  expect(replace).toHaveBeenCalledTimes(1);
  await act(async () => appearanceChanged({ colorScheme: 'light' }));
  expectDark(false);
  await act(async () => appearanceChanged({ colorScheme: 'dark' }));
  expectDark(true);
});

it.each([IAppearanceType.Light, IAppearanceType.Dark])(
  'preserves an explicit %s preference when restoring',
  async appearance => {
    useThemeConfigStore.getState().setAppearance(appearance);
    await mount();
    expectDark(false);
    await act(async () => restore([restoredPurchase]));
    expectDark(appearance === IAppearanceType.Dark);
    expect(useThemeConfigStore.getState().appearance).toBe(appearance);
  },
);

it('keeps users without purchases in light mode without overwriting Auto', async () => {
  await mount();
  await act(async () => restore([]));
  expectDark(false);
  expect(useThemeConfigStore.getState().appearance).toBe(IAppearanceType.Auto);
});

it('returns to light mode after ownership is revoked while retaining the preference for restoration', async () => {
  await mount();
  await act(async () => restore([restoredPurchase]));
  expectDark(true);
  await act(async () => useAppConfigStore.getState().setPurchased(false));
  expectDark(false);
  expect(useThemeConfigStore.getState().appearance).toBe(IAppearanceType.Auto);
});
