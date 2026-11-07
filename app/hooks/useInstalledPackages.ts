import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import { IAdsActivity } from 'app/components/AdsListItem';
import { reportDeviceActivityInventory } from 'app/services/activityAnalytics';

const { OpenSettings } = NativeModules;

export interface IInstalledPackagesHook {
  itemAvailabilityMap: Record<number, boolean>;
  isChecking: boolean;
  isItemInstalled: (item: IAdsActivity) => boolean;
  refreshInstalledPackages: () => Promise<void>;
}

export const useInstalledPackages = (entries: IAdsActivity[]): IInstalledPackagesHook => {
  const [itemAvailabilityMap, setItemAvailabilityMap] = useState<Record<number, boolean>>({});
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const serializedPayload = useMemo(() => {
    return entries.map(entry => ({
      id: entry.id,
      paths: entry.adsSettingPaths.map(p => ({
        package: p.package,
        activity: p.activity,
      })),
    }));
  }, [entries]);

  const checkAvailability = useCallback(async () => {
    if (Platform.OS !== 'android' || !OpenSettings?.checkItemsAvailability) {
      setIsChecking(false);
      return;
    }

    try {
      setIsChecking(true);
      const result: Record<string, boolean> = await OpenSettings.checkItemsAvailability(serializedPayload);
      if (result) {
        const parsedMap: Record<number, boolean> = {};
        Object.keys(result).forEach(key => {
          const id = Number(key);
          parsedMap[id] = Boolean(result[key]);
        });
        setItemAvailabilityMap(parsedMap);
        // Automatically report installed and not-installed activities to analytics
        reportDeviceActivityInventory(entries, parsedMap);
      }
    } catch (e) {
      console.warn('useInstalledPackages error:', e);
    } finally {
      setIsChecking(false);
    }
  }, [entries, serializedPayload]);

  useEffect(() => {
    if (serializedPayload.length > 0) {
      checkAvailability();
    } else {
      setIsChecking(false);
    }
  }, [serializedPayload, checkAvailability]);

  const isItemInstalled = useCallback(
    (item: IAdsActivity): boolean => {
      // If running on non-Android or not checked yet, treat as available
      if (Platform.OS !== 'android') {
        return true;
      }
      if (itemAvailabilityMap[item.id] !== undefined) {
        return Boolean(itemAvailabilityMap[item.id]);
      }
      return true;
    },
    [itemAvailabilityMap],
  );

  return {
    itemAvailabilityMap,
    isChecking,
    isItemInstalled,
    refreshInstalledPackages: checkAvailability,
  };
};

export default useInstalledPackages;
