import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserId,
  setUserProperties,
  setUserProperty,
} from '@react-native-firebase/analytics';

export const analytics = () => {
  const instance = getAnalytics();
  return {
    logEvent: (name: string, params?: Record<string, string | number | boolean | undefined | null>) =>
      logEvent(instance, name, params),
    logScreenView: (params: { screen_name?: string; screen_class?: string }) => logScreenView(instance, params),
    setUserId: (id: string | null) => setUserId(instance, id),
    setUserProperty: (name: string, value: string | null) => setUserProperty(instance, name, value),
    setUserProperties: (properties: Record<string, string | null>) => setUserProperties(instance, properties),
  };
};

export default analytics;
