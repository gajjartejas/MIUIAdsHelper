import React, {Component} from 'react';
import {StyleSheet, Dimensions, Animated, Easing} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const imageTranslateYTransform = (yAnim, maxHeight) => {
  return {
    translateY: yAnim.interpolate({
      inputRange: [0, maxHeight / 2, maxHeight],
      outputRange: [0, maxHeight / 3, maxHeight / 1.5],
      extrapolate: 'clamp',
    }),
  };
};

const imageTranslateXTransform = (xAnim, index) => {
  return {
    translateX: xAnim.interpolate({
      inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      outputRange: [-SCREEN_WIDTH / 1.5, 0, SCREEN_WIDTH / 1.5],
      extrapolate: 'clamp',
    }),
  };
};

const imageTransform = (yAnim, maxHeight, xAnim, index) => {
  let transform = [imageTranslateYTransform(yAnim, maxHeight)];
  if (xAnim) {
    transform.push(imageTranslateXTransform(xAnim, index));
  }
  return {transform};
};

class Background extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeInOpacity: new Animated.Value(0),
    };
  }

  render() {
    const {maxHeight, yAnim} = this.props;

    const translateY = yAnim.interpolate({
      inputRange: [-maxHeight, 0, maxHeight],
      outputRange: [0, 0, -maxHeight],
      extrapolate: 'clamp',
    });

    const scale = yAnim.interpolate({
      inputRange: [-maxHeight, 0],
      outputRange: [3, 1],
      extrapolate: 'clamp',
    });

    const transform = [{translateY}, {scale}];

    return <Animated.View style={[styles().container, {transform}]}>{this.renderBackgroundImage()}</Animated.View>;
  }

  renderBackgroundImage() {
    const {maxHeight, yAnim, uri, xAnim, index} = this.props;

    const {fadeInOpacity} = this.state;

    const transforms = imageTransform(yAnim, maxHeight, xAnim, index);

    return (
      <Animated.Image
        source={uri}
        resizeMode="cover"
        style={[transforms, {height: maxHeight, width: SCREEN_WIDTH}, {opacity: fadeInOpacity}]}
        onLoadEnd={(e) => {
          Animated.timing(fadeInOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
        }}
      />
    );
  }
}

var styles = () =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      top: 0,
      overflow: 'hidden',
    },
  });

export default Background;
