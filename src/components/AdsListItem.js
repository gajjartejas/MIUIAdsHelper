import React, {Component} from 'react';
import {Text, Dimensions, View, Linking, Image, StyleSheet} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import strings from '../localization/LocalizedStrings';

import Config from '../config/index';
import {AppTouchable} from '../components/AppTouchable';
import Themes from '../Themes/index';

var {width, height} = Dimensions.get('window');

export default class LicensesListItem extends Component {
  
  iconFrom = (name, family) => {
    switch (family) {
      case 'FontAwesome':
        return <FontAwesome name={name} size={26} color={Themes.getColors().COLOR_WHITE} />;
        break;
      case 'MaterialIcons':
        return <MaterialIcons name={name} size={26} color={Themes.getColors().COLOR_WHITE} />;
        break;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} size={26} color={Themes.getColors().COLOR_WHITE} />;
        break;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={name} size={26} color={Themes.getColors().COLOR_WHITE} />;
        break;
      case 'Ionicons':
        return <Ionicons name={name} size={26} color={Themes.getColors().COLOR_WHITE} />;
        break;
      case 'FontAwesome5Pro':
        return <FontAwesome5Pro name={name} size={26} color={Themes.getColors().COLOR_WHITE} />;
        break;
      default:
        return null;
        break;
    }
  };

  render() {
    const {item, index} = this.props;
    return (
      <View style={styles().container}>
        <AppTouchable style={styles().touchableButton} onPress={() => this.props.onPress(item, index)}>
          <View style={{...styles().iconContainerView, backgroundColor: item.iconBackgroundColor}}>
            {this.iconFrom(item.iconName, item.iconFamily)}
          </View>
          <Text numberOfLines={2} style={styles().titleText}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={styles().subtitleText}>
            {item.subtitle}
          </Text>
        </AppTouchable>
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      width: width / 2 - 24,
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
      paddingHorizontal: 12,
    },
    iconContainerView: {
      backgroundColor: 'red',
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
    },
    titleText: {
      fontWeight: 'bold',
      fontSize: 15,
      color: Themes.getColors().COLOR_WHITE,
      marginTop: 8,
    },
    subtitleText: {
      fontSize: 13,
      fontWeight: '500',
      color: Themes.getColors().COLOR_WHITE,
      marginTop: 12,
    },

    card: {
      borderRadius: 4,
      overflow: 'hidden',
      flexDirection: 'row',
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
      alignItems: 'center',
    },
    cardShadow: {
      marginHorizontal: 12,
      marginVertical: 6,
      shadowColor: 'black',
      shadowOpacity: 0.4,
      shadowOffset: {width: 0, height: 0},
      shadowRadius: 2,
    },
    item: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      maxWidth: '100%',
      flexWrap: 'wrap',
    },
    name: {
      fontWeight: 'bold',
      fontSize: 16,
      color: Themes.getColors().COLOR_WHITE,
    },
    image: {
      aspectRatio: 1,
      width: 96,
      borderRadius: 0,
    },
    text: {
      color: Themes.getColors().COLOR_WHITE,
      marginTop: 3,
    },
  });
