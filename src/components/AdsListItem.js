import React, {Component} from 'react';
import {Text, Dimensions, View, StyleSheet} from 'react-native';

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

//Constants
const {width} = Dimensions.get('window');

export default class LicensesListItem extends Component {
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
        <AppTouchable style={styles().touchableButton} onPress={() => this.props.onPress(item, index)}>
          {this.iconFrom(item.iconName, item.iconFamily, item.iconBackgroundColor)}
          <Text numberOfLines={1} style={styles().titleText}>
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
      marginBottom: 16,
    },
    touchableButton: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_CELL_COLOR,
      paddingVertical: 16,
      paddingHorizontal: 16,
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
      fontSize: 12,
      fontWeight: '500',
      color: Themes.getColors().COLOR_WHITE + 60,
      marginTop: 4,
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
