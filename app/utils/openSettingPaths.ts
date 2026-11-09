import type { IAdsSettingPath } from 'app/components/AdsListItem';

type OpenActivity = (packageName: string | null, activityName: string | null) => Promise<boolean>;
type OpenAppDetails = (packageName: string | null) => Promise<boolean>;

export const openSettingPaths = async (
  paths: IAdsSettingPath[],
  openActivity: OpenActivity,
  openAppDetails: OpenAppDetails,
): Promise<IAdsSettingPath | null> => {
  // Try every direct destination before falling back to a package's App info.
  for (const path of paths) {
    if (path.package && path.activity && (await openActivity(path.package, path.activity))) {
      return path;
    }
  }

  const triedPackages = new Set<string>();
  for (const path of paths) {
    if (!path.package || triedPackages.has(path.package)) continue;
    triedPackages.add(path.package);
    if (await openAppDetails(path.package)) return path;
  }

  return null;
};
