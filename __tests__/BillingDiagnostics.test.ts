import { ErrorCode } from 'react-native-iap';
const mockRecord = jest.fn();
const mockLog = jest.fn();

jest.mock('../app/services/crashlytics', () => ({
  __esModule: true,
  default: () => ({ recordError: mockRecord, log: mockLog }),
}));

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

it('reports stage and native response codes without receipts, tokens, messages, or identity fields', () => {
  const { reportBillingError } = require('../app/services/billingDiagnostics');
  const error = Object.assign(new Error('purchaseToken=SECRET account=PRIVATE'), {
    code: ErrorCode.NetworkError,
    responseCode: 12,
    debugMessage: 'orderId=PRIVATE',
    purchaseToken: 'SECRET',
    receipt: 'SECRET',
    deviceId: 'PRIVATE',
    subResponseCodeAndroid: 'user-ineligible',
  });
  expect(reportBillingError('acknowledge', error, 'com.tejasgajjar.miuiadshelper.item1')).toBe(true);
  const [reported, name] = mockRecord.mock.calls[0];
  expect(reported.message).toContain('"stage":"acknowledge"');
  expect(reported.message).toContain('"response":12');
  expect(reported.message).toContain('"subResponse":"user-ineligible"');
  expect(name).toBe('IAP_acknowledge_network-error');
  const data = reported.message + reported.stack + mockLog.mock.calls.flat().join('');
  expect(data).not.toMatch(/SECRET|PRIVATE|purchaseToken|receipt|deviceId/);
});

it('treats cancellation, already-owned, and pending outcomes as normal rather than non-fatals', () => {
  const { reportBillingError } = require('../app/services/billingDiagnostics');
  for (const code of [ErrorCode.UserCancelled, ErrorCode.AlreadyOwned, ErrorCode.Pending, ErrorCode.DeferredPayment]) {
    expect(reportBillingError('request', { code })).toBe(false);
  }
  expect(mockRecord).not.toHaveBeenCalled();
});

it('deduplicates errors reported by the request promise and native listener', () => {
  const { reportBillingError } = require('../app/services/billingDiagnostics');
  expect(reportBillingError('request', { code: ErrorCode.NetworkError })).toBe(true);
  expect(reportBillingError('listener', { code: ErrorCode.NetworkError })).toBe(false);
  expect(mockRecord).toHaveBeenCalledTimes(1);
});

it('does not let Firebase failures break the purchase flow', () => {
  const { reportBillingError } = require('../app/services/billingDiagnostics');
  mockLog.mockImplementationOnce(() => {
    throw new Error('Firebase unavailable');
  });
  expect(() => reportBillingError('restore', { code: ErrorCode.NetworkError })).not.toThrow();
});

it('never uploads arbitrary error codes or external product IDs', () => {
  const { reportBillingError } = require('../app/services/billingDiagnostics');
  reportBillingError('request', { code: 'SECRET', responseCode: 'PRIVATE' }, 'PRIVATE');
  expect(mockRecord.mock.calls[0][0].message).not.toMatch(/SECRET|PRIVATE/);
  expect(mockRecord.mock.calls[0][0].message).toContain('"code":"unknown"');
});
