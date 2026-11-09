import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { ErrorCode } from 'react-native-iap';
import { Button } from 'react-native-paper';
import Purchase from '../app/screens/Home/Purchase';
import PurchaseListItem from '../app/components/PurchaseListItem';
import { showAppDialog } from '../app/store/dialogStore';

const mockLoad = jest.fn();
const mockRequest = jest.fn();
const mockRestore = jest.fn();
const mockT = (key: string) => key;
const sku = 'com.tejasgajjar.miuiadshelper.item1';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: mockT }) }));
jest.mock('react-native-paper', () => ({
  useTheme: () => ({ colors: {} }),
  Button: 'Button',
  ActivityIndicator: 'Spinner',
}));
jest.mock('../app/components/AppHeader', () => 'Header');
jest.mock('../app/components/PurchaseListItem', () => 'PurchaseListItem');
jest.mock('../app/components', () => {
  const ReactModule = require('react');
  return {
    __esModule: true,
    default: {
      AppBaseView: ({ children }: { children: React.ReactNode }) => ReactModule.createElement('Base', null, children),
      ProcessingOverlay: 'Overlay',
    },
  };
});
jest.mock('../app/config/inapp-purchases', () => ({
  __esModule: true,
  default: () => [{ id: 0, productId: 'com.tejasgajjar.miuiadshelper.item1', name: 'Tea', subtitle: 'Support' }],
}));
jest.mock('../app/services/billing', () => ({
  connectBilling: jest.fn().mockResolvedValue(undefined),
  loadBillingProducts: () => mockLoad(),
  requestBillingPurchase: (product: string) => mockRequest(product),
}));
jest.mock('../app/services/purchaseEntitlements', () => ({ restorePurchaseEntitlement: () => mockRestore() }));
jest.mock('../app/store/dialogStore', () => ({ showAppDialog: jest.fn() }));

type Props = React.ComponentProps<typeof Purchase>;
let rendered: Renderer.ReactTestRenderer;
const renderScreen = async () => {
  await act(async () => {
    rendered = Renderer.create(
      <Purchase
        navigation={{ pop: jest.fn() } as unknown as Props['navigation']}
        route={{ key: 'purchase', name: 'Purchase', params: { fromTheme: false } }}
      />,
    );
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRestore.mockResolvedValue(false);
  mockLoad.mockResolvedValue([{ id: sku, displayPrice: '₹99' }]);
  mockRequest.mockResolvedValue(undefined);
});
afterEach(async () => {
  if (rendered) await act(async () => rendered.unmount());
});

it('shows no placeholder Buy rows when products fail and allows retry', async () => {
  mockLoad.mockRejectedValueOnce(new Error('Unavailable'));
  await renderScreen();
  expect(rendered.root.findAllByType(PurchaseListItem)).toHaveLength(0);
  const retry = rendered.root.findAllByType(Button).find(button => button.props.children === 'iap_retry');
  await act(async () => retry!.props.onPress());
  expect(rendered.root.findAllByType(PurchaseListItem)).toHaveLength(1);
});

it('clears processing after cancellation without showing a failure', async () => {
  await renderScreen();
  mockRequest.mockRejectedValueOnce({ code: ErrorCode.UserCancelled });
  const row = rendered.root.findByType(PurchaseListItem);
  await act(async () => row.props.onPress(row.props.item));
  expect(showAppDialog).not.toHaveBeenCalled();
  expect(rendered.root.findByType('Overlay' as React.ElementType).props.visible).toBe(false);
});

it('recovers AlreadyOwned through restoration instead of granting access directly', async () => {
  await renderScreen();
  mockRestore.mockResolvedValueOnce(true);
  mockRequest.mockRejectedValueOnce({ code: ErrorCode.AlreadyOwned });
  const row = rendered.root.findByType(PurchaseListItem);
  await act(async () => row.props.onPress(row.props.item));
  expect(mockRestore).toHaveBeenCalledTimes(2);
  expect(showAppDialog).toHaveBeenCalledWith('iap_purchased_already');
});

it('explains a pending payment and returns to an interactive screen', async () => {
  await renderScreen();
  mockRequest.mockRejectedValueOnce({ code: ErrorCode.Pending });
  const row = rendered.root.findByType(PurchaseListItem);
  await act(async () => row.props.onPress(row.props.item));
  expect(showAppDialog).toHaveBeenCalledWith('iap_pending');
  expect(rendered.root.findByType('Overlay' as React.ElementType).props.visible).toBe(false);
});
