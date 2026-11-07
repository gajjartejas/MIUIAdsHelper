import activityAnalytics from '../app/services/activityAnalytics';
import { IAdsActivity, IAdsSettingAppType } from '../app/components/AdsListItem';

const mockLogEvent = jest.fn();
const mockSetUserId = jest.fn();
const mockSetUserProperties = jest.fn();

jest.mock('../app/services/analytics', () => ({
  __esModule: true,
  default: () => ({
    logEvent: mockLogEvent,
    setUserId: mockSetUserId,
    setUserProperties: mockSetUserProperties,
    setUserProperty: jest.fn(),
    logScreenView: jest.fn(),
  }),
  analytics: () => ({
    logEvent: mockLogEvent,
    setUserId: mockSetUserId,
    setUserProperties: mockSetUserProperties,
    setUserProperty: jest.fn(),
    logScreenView: jest.fn(),
  }),
}));

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => Promise.resolve('test-device-uuid-123')),
  getBrand: jest.fn(() => 'Xiaomi'),
  getDevice: jest.fn(() => Promise.resolve('Redmi Pad')),
  getSystemVersion: jest.fn(() => '13'),
  getBuildNumber: jest.fn(() => '100'),
  getReadableVersion: jest.fn(() => '1.0.0'),
  getBuildId: jest.fn(() => Promise.resolve('TKQ1.221114.001')),
}));

describe('ActivityAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch device metadata correctly', async () => {
    const meta = await activityAnalytics.getDeviceMetadata();
    expect(meta.deviceId).toBe('test-device-uuid-123');
    expect(meta.brand).toBe('Xiaomi');
    expect(meta.model).toBe('Redmi Pad');
  });

  it('should report installed and not-installed inventory to analytics', async () => {
    const mockEntries: IAdsActivity[] = [
      {
        id: 0,
        appname: 'Music',
        title: 'Mi Music',
        subtitle: 'Ad recommendations',
        detail: 'Detail text',
        steps: 'Step 1',
        specialNote: 'Note',
        adsSettingPaths: [{ package: 'com.miui.player', activity: 'com.miui.player.Settings' }],
        iconBackgroundColor: '#ff0000',
        iconName: 'music',
        iconFamily: 'material',
        hideButton: false,
        appType: IAdsSettingAppType.AudioVideo,
      },
      {
        id: 1,
        appname: 'Video',
        title: 'Mi Video',
        subtitle: 'Video ads',
        detail: 'Detail text',
        steps: 'Step 1',
        specialNote: 'Note',
        adsSettingPaths: [{ package: 'com.miui.videoplayer', activity: 'com.miui.video.Settings' }],
        iconBackgroundColor: '#00ff00',
        iconName: 'video',
        iconFamily: 'material',
        hideButton: false,
        appType: IAdsSettingAppType.AudioVideo,
      },
      {
        id: 2,
        appname: 'Joyose',
        title: 'Joyose Telemetry',
        subtitle: 'Performance tracking',
        detail: 'Detail text',
        steps: 'Step 1',
        specialNote: 'Note',
        adsSettingPaths: [{ package: 'com.xiaomi.joyose', activity: null }],
        iconBackgroundColor: '#0000ff',
        iconName: 'gamepad',
        iconFamily: 'material',
        hideButton: false,
        appType: IAdsSettingAppType.DisableEnable,
      },
    ];

    const availabilityMap: Record<number, boolean> = {
      0: true,
      1: false,
      2: true,
    };

    await activityAnalytics.reportDeviceActivityInventory(mockEntries, availabilityMap, true);

    expect(mockSetUserId).toHaveBeenCalledWith('test-device-uuid-123');
    expect(mockSetUserProperties).toHaveBeenCalledWith(
      expect.objectContaining({
        device_id: 'test-device-uuid-123',
        device_brand: 'Xiaomi',
        installed_count: '2',
        not_installed_count: '1',
      }),
    );

    expect(mockLogEvent).toHaveBeenCalledWith(
      'device_activity_inventory',
      expect.objectContaining({
        device_id: 'test-device-uuid-123',
        total_activities: 3,
        installed_count: 2,
        not_installed_count: 1,
        installed_ids: '0,2',
        not_installed_ids: '1',
      }),
    );

    expect(mockLogEvent).toHaveBeenCalledWith(
      'activity_category_status',
      expect.objectContaining({
        device_id: 'test-device-uuid-123',
        category: 'AudioVideo',
        category_installed_count: 1,
        category_missing_count: 1,
      }),
    );
  });

  it('should log individual activity item status', async () => {
    const mockItem: IAdsActivity = {
      id: 25,
      appname: 'MSA',
      title: 'MIUI System Ads',
      subtitle: 'System ads',
      detail: 'Detail',
      steps: 'Steps',
      specialNote: 'Note',
      adsSettingPaths: [{ package: 'com.miui.msa.global', activity: null }],
      iconBackgroundColor: '#ff0051',
      iconName: 'android',
      iconFamily: 'material',
      hideButton: false,
      appType: IAdsSettingAppType.System,
    };

    await activityAnalytics.logActivityDetailView(mockItem, true);

    expect(mockLogEvent).toHaveBeenCalledWith('activity_item_status', {
      device_id: 'test-device-uuid-123',
      activity_id: 25,
      activity_name: 'MSA',
      primary_package: 'com.miui.msa.global',
      is_installed: 'true',
    });
  });
});
