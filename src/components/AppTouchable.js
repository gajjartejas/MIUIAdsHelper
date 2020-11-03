// function AppTouchable({style, children, onPress, rippleColor, enablePointerEvents = false, disabled = false}) {

import React from 'react';
import {TouchableNativeFeedback, TouchableOpacity, View, ViewPropTypes, StyleSheet, Platform} from 'react-native';

const OUTER_STYLES = [
  {key: 'margin', remove: true},
  {key: 'marginHorizontal', remove: true},
  {key: 'marginVertical', remove: true},
  {key: 'marginBottom', remove: true},
  {key: 'marginTop', remove: true},
  {key: 'marginLeft', remove: true},
  {key: 'marginRight', remove: true},
  {key: 'borderRadius', remove: false},
  {key: 'width', remove: true},
  {key: 'height', remove: false},
  {key: 'position', remove: true},
  {key: 'top', remove: true},
  {key: 'left', remove: true},
  {key: 'right', remove: true},
  {key: 'top', remove: true},
  {key: 'bottom', remove: true},
  {key: 'zIndex', remove: true},
  {key: 'flex', remove: true},
  {key: 'alignSelf', remove: true},
];

function AppTouchable({style, children, onPress, rippleColor = 'rgba(255,255,255,0.2)', enablePointerEvents = false, disabled = false}) {
  if (Platform.OS === 'android') {
    const flattenedStyle = StyleSheet.flatten(style);

    const outerStyle = {
      overflow: 'hidden',
    };

    if (style) {
      OUTER_STYLES.forEach(({key, remove}) => {
        if (flattenedStyle.hasOwnProperty(key)) {
          outerStyle[key] = flattenedStyle[key];
          if (remove) delete flattenedStyle[key];
        }
      });
    }

    return (
      <View style={outerStyle}>
        <TouchableNativeFeedback
          disabled={disabled}
          useForeground={TouchableNativeFeedback.canUseNativeForeground()}
          background={TouchableNativeFeedback.Ripple(rippleColor)}
          onPress={onPress}>
          <View style={flattenedStyle} pointerEvents={enablePointerEvents ? 'auto' : 'box-only'}>
            {children}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8} {...{onPress, disabled, style}}>
      {children}
    </TouchableOpacity>
  );
}

function CircularTouchable({size, children, style, onPress, rippleColor}) {
  return (
    <AppTouchable
      rippleColor={rippleColor}
      onPress={onPress}
      style={[
        {
          height: size,
          width: size,
          borderRadius: size / 2,
        },
        style,
      ]}>
      {children}
    </AppTouchable>
  );
}

AppTouchable.propTypes = {
  style: ViewPropTypes.style,
};

CircularTouchable.propTypes = {
  style: ViewPropTypes.style,
};

export {AppTouchable, CircularTouchable};
