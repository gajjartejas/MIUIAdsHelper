import { ErrorCode, initConnection, fetchProducts, requestPurchase } from 'react-native-iap';
import { connectBilling, loadBillingProducts, requestBillingPurchase } from '../app/services/billing';
import { reportBillingError } from '../app/services/billingDiagnostics';

jest.mock('../app/services/billingDiagnostics', () => {
  const actual = jest.requireActual('../app/services/billingDiagnostics');
  return { ...actual, reportBillingError: jest.fn() };
});
const init = jest.mocked(initConnection);
const fetch = jest.mocked(fetchProducts);
const request = jest.mocked(requestPurchase);
const report = jest.mocked(reportBillingError);
const sku = 'com.tejasgajjar.miuiadshelper.item1';
const failure = (code: ErrorCode) => Object.assign(new Error('Native failure'), { code });

beforeEach(() => {
  jest.clearAllMocks();
  init.mockResolvedValue(true);
  request.mockResolvedValue(null);
});

it('treats false initialization as a connection failure and reports its stage', async () => {
  init.mockResolvedValueOnce(false);
  await expect(connectBilling()).rejects.toMatchObject({ code: ErrorCode.InitConnection });
  expect(report).toHaveBeenCalledWith('connect', expect.objectContaining({ code: ErrorCode.InitConnection }));
});

it('shares concurrent connection attempts', async () => {
  let resolve!: (value: boolean) => void;
  init.mockReturnValueOnce(
    new Promise<boolean>(done => {
      resolve = done;
    }),
  );
  const first = connectBilling();
  const second = connectBilling();
  expect(init).toHaveBeenCalledTimes(1);
  resolve(true);
  await Promise.all([first, second]);
});

it('retries a transient connection failure once, without retrying permanent failures', async () => {
  init.mockRejectedValueOnce(failure(ErrorCode.ServiceDisconnected)).mockResolvedValueOnce(true);
  await connectBilling();
  expect(init).toHaveBeenCalledTimes(2);
  init.mockClear().mockRejectedValueOnce(failure(ErrorCode.BillingUnavailable));
  await expect(connectBilling()).rejects.toMatchObject({ code: ErrorCode.BillingUnavailable });
  expect(init).toHaveBeenCalledTimes(1);
});

it('reports an empty catalog instead of offering placeholder products', async () => {
  fetch.mockResolvedValueOnce([]);
  await expect(loadBillingProducts()).rejects.toMatchObject({ code: ErrorCode.ItemUnavailable });
  expect(report).toHaveBeenCalledWith('catalog', expect.objectContaining({ code: ErrorCode.ItemUnavailable }));
});

it('requests one-time products and drops unknown or unpriced products', async () => {
  const products = [
    { id: sku, displayPrice: '₹99' },
    { id: 'unknown', displayPrice: '₹9' },
    { id: 'com.tejasgajjar.miuiadshelper.item2', displayPrice: '' },
  ];
  fetch.mockResolvedValueOnce(products as Awaited<ReturnType<typeof fetchProducts>>);
  expect(await loadBillingProducts()).toEqual([products[0]]);
  expect(fetch).toHaveBeenCalledWith(expect.objectContaining({ type: 'in-app' }));
});

it('rejects overlapping requests without charging twice', async () => {
  let finish!: () => void;
  request.mockReturnValueOnce(
    new Promise<null>(done => {
      finish = () => done(null);
    }),
  );
  const first = requestBillingPurchase(sku);
  const second = requestBillingPurchase(sku);
  await new Promise(resolve => setImmediate(resolve));
  expect(request).toHaveBeenCalledTimes(1);
  finish();
  await Promise.all([first, second]);
});

it('never automatically retries a payment request and releases its lock on failure', async () => {
  request.mockRejectedValueOnce(failure(ErrorCode.NetworkError)).mockResolvedValueOnce(null);
  await expect(requestBillingPurchase(sku)).rejects.toMatchObject({ code: ErrorCode.NetworkError });
  expect(request).toHaveBeenCalledTimes(1);
  await requestBillingPurchase(sku);
  expect(request).toHaveBeenCalledTimes(2);
});

it('preserves already-owned outcomes for restoration and rejects unknown SKUs', async () => {
  request.mockRejectedValueOnce(failure(ErrorCode.AlreadyOwned));
  await expect(requestBillingPurchase(sku)).rejects.toMatchObject({ code: ErrorCode.AlreadyOwned });
  await expect(requestBillingPurchase('unknown')).rejects.toMatchObject({ code: ErrorCode.ItemUnavailable });
  expect(request).toHaveBeenCalledTimes(1);
});
