import React, {Component} from 'react';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';

//Third Party
import RNIap, {finishTransaction, purchaseErrorListener, purchaseUpdatedListener} from 'react-native-iap';

//App Modules
import Config from '../config/index';
import Themes from '../Themes/index';
import PurchaseListItem from '../components/PurchaseListItem';
import strings from '../localization/LocalizedStrings';
import {connect} from 'react-redux';
import {store} from '../store';
import {updatePurchase} from '../actions/userActions';

const itemSkus = Platform.select({
  ios: [],
  android: [
    'com.tejasgajjar.miuiadshelper.item1',
    'com.tejasgajjar.miuiadshelper.item2',
    'com.tejasgajjar.miuiadshelper.item3',
    'com.tejasgajjar.miuiadshelper.item4',
  ],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

class PurchaseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      loading: true,
      entries: [
        {
          id: 0,
          iconName: 'coffee',
          iconFamily: 'FontAwesome',
          iconBackgroundColor: '#FF0000',
          name: strings.iap_item_1,
          subtitle: strings.iap_item_1_desc,
          localizedPrice: '...',
          productId: 'com.tejasgajjar.miuiadshelper.item1',
        },
        {
          id: 1,
          iconName: 'pizza',
          iconFamily: 'MaterialCommunityIcons',
          iconBackgroundColor: '#FF0000',
          name: strings.iap_item_2,
          subtitle: strings.iap_item_2_desc,
          localizedPrice: '...',
          productId: 'com.tejasgajjar.miuiadshelper.item2',
        },
        {
          id: 2,
          iconName: 'food-bank',
          iconFamily: 'MaterialIcons',
          iconBackgroundColor: '#FF0000',
          name: strings.iap_item_3,
          subtitle: strings.iap_item_3_desc,
          localizedPrice: '...',
          productId: 'com.tejasgajjar.miuiadshelper.item3',
        },
        {
          id: 3,
          iconName: 'emoji-emotions',
          iconFamily: 'MaterialIcons',
          iconBackgroundColor: '#FF0000',
          name: strings.iap_item_4,
          subtitle: strings.iap_item_4_desc,
          localizedPrice: '...',
          productId: 'com.tejasgajjar.miuiadshelper.item4',
        },
      ],
    };
  }

  async componentDidMount() {
    try {
      await RNIap.initConnection();
      await this.getPurchases();
      await this.getItems();
      this.setState({loading: false});
      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
    } catch (err) {
      console.warn(err.code, err.message);
      alert(err.message);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.info('purchaseUpdatedListener->purchase', purchase);
      const receipt = purchase.transactionReceipt ? purchase.transactionReceipt : purchase.originalJson;
      console.info('purchaseUpdatedListener->receipt', receipt);
      if (receipt) {
        try {
          const ackResult = await RNIap.finishTransaction(purchase, false);
          console.info('purchaseUpdatedListener->ackResult', ackResult);
          store.dispatch(updatePurchase(true));
          alert(strings.iap_puraction.purchasedchased_success);
          this.props.navigation.pop();
        } catch (ackErr) {
          console.warn('purchaseUpdatedListener->ackErr', ackErr);
          alert(ackErr.message);
        }
      } else {
        console.warn('purchaseUpdatedListener->receipt->not found');
      }
    });

    purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.log('purchaseErrorListener', error);
      alert(error.message);
    });
  }

  componentWillUnmount() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  }

  getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      let mappedEntries = products.map((anObj1) => ({
        ...this.state.entries.find((anObj2) => anObj1.productId === anObj2.productId),
        ...anObj1,
      }));
      this.setState({entries: mappedEntries});
    } catch (err) {
      console.warn('getItems:', err.code, err.message);
      alert(err.message);
    }
  };

  // Version 3 apis
  requestPurchase = async (sku) => {
    try {
      let purchaseResult = await RNIap.requestPurchase(sku);
      console.log('purchaseResult', purchaseResult);
    } catch (err) {
      console.warn('requestPurchase:', err.code, err.message);
      alert(err.message);
    }
  };

  getPurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        store.dispatch(updatePurchase(true));
        if (!this.props.route.params || !this.props.route.params.fromTheme) {
          this.props.navigation.pop();
          setTimeout(() => {
            alert(strings.iap_purchased_already);
          }, 300);
        } else {
          this.props.navigation.navigate('SelectTheme');
        }
      }
      console.log('purchases', purchases);
    } catch (err) {
      console.warn(err);
      console.warn('getPurchases:', err.code, err.message);
    }
  };

  onPressItem = (item, index) => {
    this.requestPurchase(item.productId);
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles().activityIndicator}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles().container}>
        <ScrollView style={styles().scrollview}>
          <Text style={styles().titleText}>{strings.iap_title}</Text>
          <Text style={styles().descText}>{strings.iap_desc}</Text>
          {this.state.entries.map((item, index) => {
            return <PurchaseListItem onPress={this.onPressItem} key={item.id} item={item} index={index} />;
          })}
        </ScrollView>
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
    scrollview: {
      flex: 1,
      paddingVertical: 16,
    },
    titleText: {
      fontSize: 14,
      fontWeight: '600',
      color: Themes.getColors().COLOR_WHITE + 'cc',
      alignSelf: 'center',
      textAlign: 'center',
    },
    descText: {
      fontSize: 12,
      color: Themes.getColors().COLOR_WHITE + 'cc',
      alignSelf: 'center',
      textAlign: 'center',
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 30,
    },
    activityIndicator: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Themes.getColors().COLOR_BACKGROUND_COLOR,
    },
  });

const mapStateToProps = (state) => ({
  purchased: state.user.purchased,
});

export default connect(mapStateToProps, null)(PurchaseScreen);
