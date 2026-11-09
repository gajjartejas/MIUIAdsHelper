import { openSettingPaths } from '../app/utils/openSettingPaths';

describe('openSettingPaths', () => {
  it('tries later activities before falling back to App info', async () => {
    const paths = [
      { package: 'com.android.settings', activity: 'MissingActivity' },
      { package: 'com.android.settings', activity: 'MiuiSettings' },
    ];
    const openActivity = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const openAppDetails = jest.fn();

    expect(await openSettingPaths(paths, openActivity, openAppDetails)).toBe(paths[1]);
    expect(openActivity).toHaveBeenCalledTimes(2);
    expect(openAppDetails).not.toHaveBeenCalled();
  });

  it('checks alternate packages and opens App info only once per package', async () => {
    const paths = [
      { package: 'missing.package', activity: 'MissingActivity' },
      { package: 'missing.package', activity: null },
      { package: 'installed.package', activity: null },
    ];
    const openActivity = jest.fn().mockResolvedValue(false);
    const openAppDetails = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    expect(await openSettingPaths(paths, openActivity, openAppDetails)).toBe(paths[2]);
    expect(openAppDetails.mock.calls).toEqual([['missing.package'], ['installed.package']]);
  });

  it('prefers a direct activity even when a package-only path comes first', async () => {
    const paths = [
      { package: 'first.package', activity: null },
      { package: 'second.package', activity: 'SettingsActivity' },
    ];
    const openActivity = jest.fn().mockResolvedValue(true);
    const openAppDetails = jest.fn();

    expect(await openSettingPaths(paths, openActivity, openAppDetails)).toBe(paths[1]);
    expect(openAppDetails).not.toHaveBeenCalled();
  });

  it('returns failure when no configured destination can be opened', async () => {
    const openActivity = jest.fn().mockResolvedValue(false);
    const openAppDetails = jest.fn().mockResolvedValue(false);

    expect(
      await openSettingPaths(
        [
          { package: null, activity: null },
          { package: 'missing.package', activity: null },
        ],
        openActivity,
        openAppDetails,
      ),
    ).toBeNull();
    expect(openActivity).not.toHaveBeenCalled();
    expect(await openSettingPaths([], openActivity, openAppDetails)).toBeNull();
  });
});
