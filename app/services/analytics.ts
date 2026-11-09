import { getAnalytics, logEvent, logScreenView, setUserId, setUserProperties } from '@react-native-firebase/analytics';

let privacyCleanup: Promise<void> | undefined;

// Clear identity and inventory properties persisted by older app versions before
// sending new custom events. Never repopulate these properties or a custom user ID.
const clearLegacyProperties = (): Promise<void> => {
  if (!privacyCleanup) {
    const instance = getAnalytics();
    privacyCleanup = (async () => {
      await setUserId(instance, null);
      await setUserProperties(instance, {
        device_id: null,
        device_brand: null,
        device_model: null,
        miui_version: null,
        installed_count: null,
        not_installed_count: null,
      });
    })().catch(error => {
      privacyCleanup = undefined;
      throw error;
    });
  }
  return privacyCleanup;
};

export const analytics = () => {
  const instance = getAnalytics();
  return {
    logEvent: (name: string, params?: Record<string, string | number | boolean | undefined | null>) =>
      clearLegacyProperties()
        .then(() => logEvent(instance, name, params))
        .catch(() => {}),
    logScreenView: (params: { screen_name?: string; screen_class?: string }) =>
      clearLegacyProperties()
        .then(() => logScreenView(instance, params))
        .catch(() => {}),
  };
};

export default analytics;
