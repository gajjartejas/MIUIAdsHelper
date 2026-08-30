import InAppReview from 'react-native-in-app-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rateApp = async (): Promise<void> => {
  const lastDateAppReviewed = await AsyncStorage.getItem('APP_LAST_REVIEW_DATE');
  if (lastDateAppReviewed !== null) {
    const today = new Date().getTime();
    const leftTime = Math.abs(today - Date.parse(lastDateAppReviewed));
    const leftDays = Math.ceil(leftTime / (1000 * 60 * 60 * 24));
    if (leftDays > 15) {
      await AsyncStorage.setItem('APP_LAST_REVIEW_DATE', new Date().toString());
      InAppReview.RequestInAppReview();
    }
  } else {
    await AsyncStorage.setItem('APP_LAST_REVIEW_DATE', new Date().toString());
    InAppReview.RequestInAppReview();
  }
};

const rateAppIfNeeded = async (): Promise<void> => {
  const appItemsViews = await getItems();
  const appItemsViewsCount = appItemsViews.length;
  if (appItemsViewsCount >= 2) {
    rateApp();
  }
};

interface IItemWithId {
  id: number | string;
}

const saveItem = async (item: IItemWithId): Promise<void> => {
  const rawAppItemsViews = await AsyncStorage.getItem('APP_ITEM_VIEWS');
  let appItemsViews: (number | string)[] = [item.id];
  if (rawAppItemsViews) {
    const parsed = JSON.parse(rawAppItemsViews);
    if (Array.isArray(parsed)) {
      appItemsViews = parsed;
      if (appItemsViews.indexOf(item.id) === -1) {
        appItemsViews.push(item.id);
      }
    }
  }
  await AsyncStorage.setItem('APP_ITEM_VIEWS', JSON.stringify(appItemsViews));
};

const getItems = async (): Promise<(number | string)[]> => {
  const rawAppItemsViews = await AsyncStorage.getItem('APP_ITEM_VIEWS');
  if (rawAppItemsViews) {
    const appItemsViews = JSON.parse(rawAppItemsViews);
    if (Array.isArray(appItemsViews)) {
      return appItemsViews;
    }
  }
  return [];
};

export default { rateAppIfNeeded, saveItem };
