import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
import crashlytics from 'app/services/crashlytics';
import { showAppDialog } from 'app/store/dialogStore';

const openInAppBrowser = async (url: string): Promise<void> => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url);
    } else {
      await Linking.openURL(url);
    }
  } catch (e: unknown) {
    crashlytics().recordError(e, 'openInAppBrowser.ts->openInAppBrowser');
    const message = e instanceof Error ? e.message : JSON.stringify(e);
    showAppDialog(message);
  }
};

export const openBrowser = async (url: string): Promise<void> => {
  try {
    await Linking.openURL(url);
  } catch (e: unknown) {
    crashlytics().recordError(e, 'openInAppBrowser.ts->openBrowser');
    const message = e instanceof Error ? e.message : String(e);
    showAppDialog(message);
  }
};

export default openInAppBrowser;
