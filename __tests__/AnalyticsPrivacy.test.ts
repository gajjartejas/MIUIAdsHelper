const mockSetUserId = jest.fn();
const mockSetUserProperties = jest.fn();
const mockLogEvent = jest.fn();
const mockLogScreenView = jest.fn();

jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: () => 'analytics-instance',
  setUserId: (...args: unknown[]) => mockSetUserId(...args),
  setUserProperties: (...args: unknown[]) => mockSetUserProperties(...args),
  logEvent: (...args: unknown[]) => mockLogEvent(...args),
  logScreenView: (...args: unknown[]) => mockLogScreenView(...args),
}));

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
  mockSetUserId.mockResolvedValue(undefined);
  mockSetUserProperties.mockResolvedValue(undefined);
  mockLogEvent.mockResolvedValue(undefined);
  mockLogScreenView.mockResolvedValue(undefined);
});

it('clears legacy identity and inventory properties before new events, once per session', async () => {
  const { default: analytics } = require('../app/services/analytics');
  await analytics().logScreenView({ screen_name: 'Home' });
  await analytics().logEvent('iap_purchase_success', { productId: 'product' });
  expect(mockSetUserId).toHaveBeenCalledTimes(1);
  expect(mockSetUserId).toHaveBeenCalledWith('analytics-instance', null);
  expect(mockSetUserProperties).toHaveBeenCalledWith('analytics-instance', {
    device_id: null,
    device_brand: null,
    device_model: null,
    miui_version: null,
    installed_count: null,
    not_installed_count: null,
  });
  expect(mockSetUserProperties.mock.invocationCallOrder[0]).toBeLessThan(mockLogScreenView.mock.invocationCallOrder[0]);
  expect(mockLogEvent).toHaveBeenCalledWith('analytics-instance', 'iap_purchase_success', { productId: 'product' });
});

it('does not send new events if clearing legacy properties fails, then retries', async () => {
  mockSetUserId.mockRejectedValueOnce(new Error('Unavailable'));
  const { default: analytics } = require('../app/services/analytics');
  await analytics().logEvent('first');
  expect(mockLogEvent).not.toHaveBeenCalled();
  await analytics().logEvent('retry');
  expect(mockLogEvent).toHaveBeenCalledTimes(1);
});
