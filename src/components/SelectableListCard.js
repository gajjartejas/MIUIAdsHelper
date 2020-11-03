import React, {Component} from 'react';
import {Text, Dimensions, View, StyleSheet} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Config from '../config/index';
import {AppTouchable} from './AppTouchable';
import Themes from '../Themes/index';

var {width, height} = Dimensions.get('window');

export default class SelectableListCard extends Component {
  render() {
    const {item, index} = this.props;
    return (
      <View style={styles().container}>
        <AppTouchable style={styles().touchableButton} onPress={() => this.props.onPress(item, index)}>
          <View style={styles().touchableContainerView}>
            <Text numberOfLines={2} style={styles().nameText}>
              {item.name}
            </Text>
            {item.selected && <FontAwesome name={'check-circle'} size={18} color={Themes.getColors().COLOR_PRIMARY} />}
          </View>
        </AppTouchable>
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
      borderRadius: 18,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowColor: Themes.getColors().COLOR_BLACK,
      elevation: 8,
      shadowOpacity: 1.0,
      shadowRadius: 2,
      marginBottom: 16,
    },
    touchableButton: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
      paddingVertical: 12,
    },
    touchableContainerView: {
      marginHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameText: {
      fontSize: 14,
      fontWeight: '500',
      color: Themes.getColors().COLOR_WHITE,
      flex: 1,
    },
  });
