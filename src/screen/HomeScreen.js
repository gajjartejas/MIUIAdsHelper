import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import Config from '../config/index';
import Components from '../components/index';
import Themes from '../Themes/index';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      entries: Config.getSettingActivities(),
    };
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  cardTapped = (item, index) => {
    this.props.navigation.navigate('Detail', {item: item});
  };

  _renderItem = ({item, index}) => {
    return <Components.AdsListItem item={item} index={index} onPress={this.cardTapped} />;
  };

  render() {
    return (
      <View style={styles().container}>
        <View style={styles().carouselContainer}>
          <FlatList
            style={styles().flatlist}
            data={this.state.entries}
            extraData={this.state}
            keyExtractor={(item, index) => item.id}
            renderItem={this._renderItem}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={{paddingVertical: 16, paddingHorizontal: 16}}
            numColumns={2}
          />
        </View>
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    flatlist: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_COLOR,
    },
    carouselContainer: {
      flex: 1,
    },
  });

export default HomeScreen;
