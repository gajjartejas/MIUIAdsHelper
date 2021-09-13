import React, {Component} from 'react';

import {StyleSheet, View, FlatList} from 'react-native';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

//App Modules
import Components from '../components/index';
import {supportedLanguages} from '../localization/SupportedLanguages';
import Themes from '../Themes/index';
import strings from '../localization/LocalizedStrings';

class SelectLanguageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supportedLanguages: supportedLanguages,
    };
  }

  async componentDidMount() {
    let languageCode = await AsyncStorage.getItem('app_language');

    this.state.supportedLanguages.forEach((value) => {
      value.selected = value.languageCode === languageCode;
    });

    this.setState({
      supportedLanguages: this.state.supportedLanguages,
    });
  }

  cardTapped = (item, index) => {
    strings.setLanguage(item.languageCode);
    AsyncStorage.setItem('app_language', item.languageCode);

    this.state.supportedLanguages.forEach((value) => {
      value.selected = value.languageCode === item.languageCode;
    });

    this.setState({
      supportedLanguages: this.state.supportedLanguages,
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
            data={this.state.supportedLanguages}
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

export default SelectLanguageScreen;
