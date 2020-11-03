import React, {Component} from 'react';

import {
  Button,
  ScrollView,
  Dimensions,
  StatusBar,
  Navigator,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Platform,
  WebView,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import strings from '../localization/LocalizedStrings';
import RNRestart from 'react-native-restart';

import Config from '../config/index';
import Components from '../components/index';
import Themes from '../Themes/index';

class SelectThemeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themes: Themes.getThemes(),
    };
  }

  async componentDidMount() {
    let scheme = await AsyncStorage.getItem('app_theme');

    this.state.themes.forEach((value) => {
      value.selected = value.scheme == scheme;
    });

    this.setState({
      themes: this.state.themes,
    });
  }

  cardTapped = (item, index) => {
    AsyncStorage.setItem('app_theme', item.scheme);
    this.state.themes.forEach((value) => {
      value.selected = value.scheme == item.scheme;
    });
    this.setState({
      themes: this.state.themes,
    });
    setTimeout(() => {
      RNRestart.Restart();
    }, 500);
  };

  _renderItem = ({item, index}) => {
    return <Components.SelectableListCard item={item} index={index} onPress={this.cardTapped} />;
  };

  render() {
    return (
      <View style={styles().container}>
        <View style={styles().carouselContainer}>
          <FlatList
            style={{flex: 1}}
            data={this.state.themes}
            extraData={this.state}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this._renderItem}
            contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 16}}
          />
        </View>
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_COLOR,
    },
    carouselContainer: {
      flex: 1,
    },
  });

export default SelectThemeScreen;
