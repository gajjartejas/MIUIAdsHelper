import React, {Component} from 'react';
import {StyleSheet, View, FlatList, SafeAreaView} from 'react-native';

//App Modules
import Config from '../config/index';
import Components from '../components/index';
import Themes from '../Themes/index';
import RNBootSplash from 'react-native-bootsplash';
import Utils from '../utils/index';
import {connect} from 'react-redux';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      entries: Config.getSettingActivities(),
    };
  }

  componentDidMount() {
    RNBootSplash.hide({fade: true});
  }

  cardTapped = (item, index) => {
    Utils.RateApp.saveItem(item);
    this.props.navigation.navigate('Detail', {item: item});
  };

  _renderItem = ({item, index}) => {
    return <Components.AdsListItem item={item} index={index} onPress={this.cardTapped} />;
  };

  render() {
    return (
      <SafeAreaView style={styles().container}>
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
      </SafeAreaView>
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

const mapStateToProps = (state) => ({
  purchased: state.user.purchased,
});

export default connect(mapStateToProps, null)(HomeScreen);
