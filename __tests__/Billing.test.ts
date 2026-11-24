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

afterEach(() => jest.useRealTimers());

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

it('recovers a catalog query wrapped as QueryProduct with native network response 12', async () => {
  const error = Object.assign(failure(ErrorCode.QueryProduct), { responseCode: 12 });
  const products = [{ id: sku, displayPrice: '₹99' }] as Awaited<ReturnType<typeof fetchProducts>>;
  fetch.mockRejectedValueOnce(error).mockResolvedValueOnce(products);
  await expect(loadBillingProducts()).resolves.toEqual(products);
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(report).toHaveBeenCalledWith('catalog', error);
});

it('bounds catalog retries and permits a later manual retry after repeated network failure', async () => {
  const error = Object.assign(failure(ErrorCode.QueryProduct), { responseCode: 12 });
  fetch.mockRejectedValueOnce(error).mockRejectedValueOnce(error).mockResolvedValueOnce([]);
  await expect(loadBillingProducts()).rejects.toBe(error);
  expect(fetch).toHaveBeenCalledTimes(2);
  await expect(loadBillingProducts()).rejects.toMatchObject({ code: ErrorCode.ItemUnavailable });
  expect(fetch).toHaveBeenCalledTimes(3);
});

it.each([3, 4, 5, 1, undefined, '12'])(
  'does not retry a catalog response that is permanent, unknown, or malformed (%s)',
  async responseCode => {
    const error = Object.assign(failure(ErrorCode.QueryProduct), { responseCode });
    fetch.mockRejectedValueOnce(error);
    await expect(loadBillingProducts()).rejects.toBe(error);
    expect(fetch).toHaveBeenCalledTimes(1);
  },
);

it('shares simultaneous catalog reads instead of duplicating native queries', async () => {
  let finish!: (products: Awaited<ReturnType<typeof fetchProducts>>) => void;
  fetch.mockReturnValueOnce(
    new Promise(resolve => {
      finish = resolve;
    }),
  );
  const first = loadBillingProducts();
  const second = loadBillingProducts();
  await new Promise(resolve => setImmediate(resolve));
  expect(fetch).toHaveBeenCalledTimes(1);
  finish([]);
  await Promise.all([
    expect(first).rejects.toMatchObject({ code: ErrorCode.ItemUnavailable }),
    expect(second).rejects.toMatchObject({ code: ErrorCode.ItemUnavailable }),
  ]);
});

it('does not retry a timed-out catalog query while the original native query may still be running', async () => {
  jest.useFakeTimers();
  fetch.mockReturnValueOnce(new Promise(() => {}));
  const assertion = expect(loadBillingProducts()).rejects.toMatchObject({ code: ErrorCode.ServiceTimeout });
  await jest.advanceTimersByTimeAsync(15000);
  await assertion;
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
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
