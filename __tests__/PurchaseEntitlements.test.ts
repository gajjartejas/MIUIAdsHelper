import { Purchase } from 'react-native-iap';
import { completePurchaseEntitlement, restorePurchaseEntitlement } from '../app/services/purchaseEntitlements';

const mockGetPurchases = jest.fn();
const mockFinish = jest.fn();
const mockSetPurchased = jest.fn();
const mockRecordError = jest.fn();

jest.mock('react-native-iap', () => ({
  ErrorCode: {
    Unknown: 'unknown',
    UserCancelled: 'user-cancelled',
    AlreadyOwned: 'already-owned',
    Pending: 'pending',
    DeferredPayment: 'deferred-payment',
    ServiceTimeout: 'service-timeout',
    SyncError: 'sync-error',
  },
  getAvailablePurchases: () => mockGetPurchases(),
  finishTransaction: (args: unknown) => mockFinish(args),
}));
jest.mock('../app/store/appConfig', () => ({
  __esModule: true,
  default: { getState: () => ({ setPurchased: mockSetPurchased }) },
}));
jest.mock('../app/services/crashlytics', () => ({
  __esModule: true,
  default: () => ({ recordError: mockRecordError, log: jest.fn() }),
}));

const purchase = (overrides: Partial<Purchase> = {}): Purchase =>
  ({
    productId: 'com.tejasgajjar.miuiadshelper.item1',
    purchaseState: 'purchased',
    isAcknowledgedAndroid: false,
    ...overrides,
  } as Purchase);

beforeEach(() => {
  jest.resetAllMocks();
  mockFinish.mockResolvedValue(undefined);
});

it('waits for acknowledgment before granting a restored purchase', async () => {
  let acknowledge!: () => void;
  const pending = new Promise<void>(resolve => {
    acknowledge = resolve;
  });
  mockFinish.mockReturnValue(pending);
  mockGetPurchases.mockResolvedValue([purchase()]);
  const restore = restorePurchaseEntitlement();
  await new Promise(resolve => setImmediate(resolve));
  expect(mockSetPurchased).not.toHaveBeenCalled();
  acknowledge();
  expect(await restore).toBe(true);
  expect(mockFinish).toHaveBeenCalledWith({ purchase: purchase(), isConsumable: false });
  expect(mockSetPurchased).toHaveBeenCalledWith(true);
});

it('clears cached access when all supported acknowledgments fail', async () => {
  mockGetPurchases.mockResolvedValue([purchase()]);
  mockFinish.mockRejectedValue(new Error('Store acknowledgment failed'));
  expect(await restorePurchaseEntitlement()).toBe(false);
  expect(mockSetPurchased).toHaveBeenCalledWith(false);
});

it('clears cached access after an authoritative empty query', async () => {
  mockGetPurchases.mockResolvedValue([]);
  expect(await restorePurchaseEntitlement()).toBe(false);
  expect(mockSetPurchased).toHaveBeenCalledWith(false);
});

it('keeps cached access when the store query fails and can retry later', async () => {
  mockGetPurchases.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce([]);
  await expect(restorePurchaseEntitlement()).rejects.toThrow('Offline');
  expect(mockSetPurchased).not.toHaveBeenCalled();
  expect(await restorePurchaseEntitlement()).toBe(false);
});

it('does not grant pending, unknown, or unrelated purchases', async () => {
  mockGetPurchases.mockResolvedValue([
    purchase({ purchaseState: 'pending' }),
    purchase({ purchaseState: 'unknown' }),
    purchase({ productId: 'unrelated.product' }),
  ]);
  expect(await restorePurchaseEntitlement()).toBe(false);
  expect(mockFinish).not.toHaveBeenCalled();
  expect(await completePurchaseEntitlement(purchase({ purchaseState: 'pending' }))).toBe(false);
  expect(mockSetPurchased).not.toHaveBeenCalledWith(true);
});

it('restores acknowledged purchases without acknowledging them again', async () => {
  mockGetPurchases.mockResolvedValue([purchase({ isAcknowledgedAndroid: true })]);
  expect(await restorePurchaseEntitlement()).toBe(true);
  expect(mockFinish).not.toHaveBeenCalled();
});

it('keeps valid access if another supported purchase cannot be acknowledged', async () => {
  mockGetPurchases.mockResolvedValue([
    purchase(),
    purchase({ productId: 'com.tejasgajjar.miuiadshelper.item2', isAcknowledgedAndroid: true }),
  ]);
  mockFinish.mockRejectedValue(new Error('Acknowledgment failed'));
  expect(await restorePurchaseEntitlement()).toBe(true);
  expect(mockSetPurchased).toHaveBeenCalledWith(true);
});

it('never grants a live purchase whose acknowledgment fails', async () => {
  mockFinish.mockRejectedValue(new Error('Acknowledgment failed'));
  await expect(completePurchaseEntitlement(purchase())).rejects.toThrow('Acknowledgment failed');
  expect(mockSetPurchased).not.toHaveBeenCalled();
});

it('serializes startup restoration and live updates to prevent stale overwrites', async () => {
  let resolveQuery!: (items: Purchase[]) => void;
  mockGetPurchases.mockReturnValue(
    new Promise<Purchase[]>(resolve => {
      resolveQuery = resolve;
    }),
  );
  const restore = restorePurchaseEntitlement();
  const complete = completePurchaseEntitlement(purchase({ isAcknowledgedAndroid: true }));
  await new Promise(resolve => setImmediate(resolve));
  expect(mockSetPurchased).not.toHaveBeenCalled();
  resolveQuery([]);
  await Promise.all([restore, complete]);
  expect(mockSetPurchased.mock.calls).toEqual([[false], [true]]);
});
