import { getCrashlytics, recordError, log } from '@react-native-firebase/crashlytics';

export const crashlytics = () => {
  const instance = getCrashlytics();
  return {
    recordError: (error: unknown, jsErrorName?: string) => {
      const err =
        error instanceof Error
          ? error
          : new Error(typeof error === 'string' ? error : JSON.stringify(error));
      recordError(instance, err, jsErrorName);
    },
    log: (message: string) => log(instance, message),
  };
};

export default crashlytics;
