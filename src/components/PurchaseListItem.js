import React, {Component} from 'react';
import {Text, Dimensions, View, StyleSheet, TouchableOpacity} from 'react-native';

//Third Party
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

//App Modules
import {AppTouchable} from './AppTouchable';
import Themes from '../Themes/index';
import strings from '../localization/LocalizedStrings';

export default class PurchaseListItem extends Component {
  iconFrom = (name, family, color) => {
    switch (family) {
      case 'FontAwesome':
        return <FontAwesome name={name} size={26} color={color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={name} size={26} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={name} size={26} color={color} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={name} size={26} color={color} />;
      case 'Ionicons':
        return <Ionicons name={name} size={26} color={color} />;
      case 'FontAwesome5Pro':
        return <FontAwesome5Pro name={name} size={26} color={color} />;
      default:
        return null;
    }
  };

  render() {
    const {item, index} = this.props;
    return (
      <View style={styles().container}>
        {this.iconFrom(item.iconName, item.iconFamily, item.iconBackgroundColor)}
        <View style={styles().textContainer}>
          <Text numberOfLines={1} style={styles().titleText}>
            {item.name}
          </Text>
          <Text numberOfLines={2} style={styles().subtitleText}>
            {item.subtitle}
          </Text>
          <Text numberOfLines={2} style={styles().subtitleText}>
            {item.localizedPrice}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress(item, index);
          }}
          style={styles().buyButton}>
          <Text style={styles().buyTextButton}>{strings.iap_buy}</Text>
        </TouchableOpacity>
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
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    touchableButton: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
      paddingVertical: 16,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      fontWeight: 'bold',
      fontSize: 15,
      color: Themes.getColors().COLOR_WHITE,
    },
    subtitleText: {
      fontSize: 12,
      fontWeight: '500',
      color: Themes.getColors().COLOR_WHITE + 60,
      marginTop: 2,
    },
    textContainer: {
      marginHorizontal: 20,
      flex: 1,
      color: Themes.getColors().COLOR_WHITE,
    },
    buyButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    buyTextButton: {
      fontSize: 14,
      fontWeight: '800',
      color: Themes.getColors().COLOR_PRIMARY,
    },
  });
