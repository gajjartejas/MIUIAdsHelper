import React from 'react';
import {StyleSheet, View, StatusBar, AppState} from 'react-native';
import Constant from '../config/Constant';
import Themes from '../Themes/index';

export default class AppGlobalModule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles().container}>
        <StatusBar backgroundColor={Themes.getColors().COLOR_TRANSPARENT} barStyle={'light-content'} translucent={true} />
        {this.props.children}
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: Themes.getColors().COLOR_BLACK,
    },
  });
