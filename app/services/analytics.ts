import { getAnalytics, logEvent, logScreenView } from '@react-native-firebase/analytics';

export const analytics = () => {
  const instance = getAnalytics();
  return {
    logEvent: (name: string, params?: Record<string, string | number | boolean | undefined | null>) =>
      logEvent(instance, name, params),
    logScreenView: (params: { screen_name?: string; screen_class?: string }) => logScreenView(instance, params),
  };
};

export default analytics;
