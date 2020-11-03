import {Platform, StatusBar, Dimensions} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Modules from '../module/index';

import Config from '../config/index';
import CustomModules from '../module/index';

const {width, height} = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 400;
const guidelineBaseHeight = 680;
const scale = (size) => ((width < height ? width : height) / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const Storage = {
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
  },
};

const decreaseSize = (width) => {
  if (isTablet()) {
    return width * 0.8;
  } else {
    return width;
  }
};

const increaseSize = (size) => {
  if (isTablet()) {
    return size * 1.5;
  } else {
    return size;
  }
};

const isTablet = () => {
  return DeviceInfo.isTablet();
};

const getStatusBarHeight = (safe) => {
  const dimen = Dimensions.get('window');

  if (Platform.OS === 'ios') {
    if (!Platform.isPad && !Platform.isTVOS && (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)) {
      return isPortrait() ? 44 : 20;
    } else {
      return 20;
    }
  } else {
    return StatusBar.currentHeight;
  }
};

const isIphoneX = () => {
  const dimen = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
  );
};

const emailValidation = (email) => {
  var emailString = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.+[A-Za-z]{2,64}';

  if (email == '') {
    alert('Email not entered.');
  } else if (!email.match(emailString)) {
    alert('Email format not valid.');
  }

  return email.match(emailString);
};

const passwordValidation = (password) => {
  if (password == '') {
    alert('Password not entered.');
  } else if (password.length < 6) {
    alert('Password format not valid.');
  }
  return password.length >= 6;
};

const manageApiResponseCode = (res) => {
  let rootNavigator = Modules.RootNavigation.getNavigator();
  if (res.status_code === 403 || res.status_code === 401) {
    Modules.UserSession.SOCKET_REF.disconnect();

    AsyncStorage.removeItem('data');
    AsyncStorage.removeItem('lastSyncDate');

    rootNavigator.navigate('Auth');
  } else if (res.status_code === 102) {
    rootNavigator.navigate('AccountDeactivated', {supportEmail: res.data.support_email});
  }
};

const underDevelopmentAlert = () => {
  CustomModules.DropDownAlert.show('warn', 'Coming Soon', 'Under development');
};

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * Get orientation : 'portrait' : 'landscape'
 */
const orientation = () => {
  return isPortrait() ? 'portrait' : 'landscape';
};

export default {
  decreaseSize,
  increaseSize,
  isTablet,
  getStatusBarHeight,
  isIphoneX,
  emailValidation,
  passwordValidation,
  manageApiResponseCode,
  Storage,
  underDevelopmentAlert,
  scale,
  verticalScale,
  moderateScale,
  isPortrait,
  orientation,
};
