import {Appearance} from 'react-native';

const LIGHT_COLORS = {
  COLOR_TRANSPARENT: 'transparent',
  COLOR_BLACK: '#FFFFFF',
  COLOR_WHITE: '#000000',

  COLOR_PRIMARY: '#f4511e',
  COLOR_BACKGROUND_COLOR: '#EEEEEE',
  COLOR_BACKGROUND_CELL_COLOR: '#FFFFFF',
  COLOR_RED: '#FF0000',
};

const DARK_COLORS = {
  COLOR_TRANSPARENT: 'transparent',
  COLOR_BLACK: '#000000',
  COLOR_WHITE: '#FFFFFF',

  COLOR_PRIMARY: '#f4511e',
  COLOR_BACKGROUND_COLOR: '#000000',
  COLOR_BACKGROUND_CELL_COLOR: '#222222',
  COLOR_RED: '#FF0000',
};

let colorScheme;

const configure = (scheme) => {
  colorScheme = scheme;
};

const getColors = () => {
  const systemColorScheme = Appearance.getColorScheme();

  if (colorScheme === 'dark') {
    return DARK_COLORS;
  } else if (colorScheme === 'light') {
    return LIGHT_COLORS;
  } else if (colorScheme === 'auto') {
    return systemColorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  } else {
    return LIGHT_COLORS;
  }
};

module.exports = {
  configure,
  getColors,
};
