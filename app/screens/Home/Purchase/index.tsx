import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View, StatusBar } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PurchaseListItem, { IProduct } from 'app/components/PurchaseListItem';
import { useTranslation } from 'react-i18next';
import RNIap, { ProductPurchase, purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
import { Appbar, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';

//App Modules
import styles from './styles';
import useInappPurchases from 'app/config/inapp-purchases';
import { updatePurchase } from 'app/store/actions/appConfigActions';

const itemSkus = [
  'com.tejasgajjar.miuiadshelper.item1',
  'com.tejasgajjar.miuiadshelper.item2',
  'com.tejasgajjar.miuiadshelper.item3',
  'com.tejasgajjar.miuiadshelper.item4',
];

let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;
//Params
type RootStackParamList = {
  PurchaseScreen: { fromTheme: boolean };
  SelectAppearance: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseScreen'>;

const PurchaseScreen = ({ navigation, route }: Props) => {
  //Const
  const iaps = useInappPurchases();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  //States
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<IProduct[]>([]);

  useEffect(() => {
    initPurchase();
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initPurchase = async () => {
    try {
      await RNIap.initConnection();

      await getPurchases();

      await getItems();

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
    } catch (err: any) {
      console.warn(err.code, err.message);
      // @ts-ignore
      alert(err.message);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: ProductPurchase) => {
      console.info('purchaseUpdatedListener->purchase', purchase);
      const receipt = purchase.transactionReceipt;
      console.info('purchaseUpdatedListener->receipt', receipt);
      if (receipt) {
        try {
          const ackResult = await RNIap.finishTransaction(purchase, false);
          console.info('purchaseUpdatedListener->ackResult', ackResult);
          dispatch(updatePurchase(true));
          // @ts-ignore
          alert(t('iap_puraction.purchasedchased_success'));
          navigation.pop();
        } catch (ackErr) {
          console.warn('purchaseUpdatedListener->ackErr', ackErr);
          // @ts-ignore
          alert(ackErr.message);
        }
      } else {
        console.warn('purchaseUpdatedListener->receipt->not found');
      }
    });

    purchaseErrorSubscription = purchaseErrorListener(error => {
      console.log('purchaseErrorListener', error);
      // @ts-ignore
      alert(error.message);
    });
  };

  const getItems = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      let mappedEntries: IProduct[] = products.map(anObj1 => ({
        ...iaps.find(anObj2 => anObj1.productId === anObj2.productId)!,
        ...anObj1,
      }));
      setEntries(mappedEntries);
    } catch (err: any) {
      console.warn('getItems:', err.code, err.message);
      // @ts-ignore
      alert(err.message);
    }
  };

  // Version 3 apis
  const requestPurchase = async (sku: string) => {
    try {
      let purchaseResult = await RNIap.requestPurchase(sku);
      console.log('purchaseResult', purchaseResult);
    } catch (err: any) {
      console.warn('requestPurchase:', err.code, err.message);
      // @ts-ignore
      alert(err.message);
    }
  };

  const getPurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        dispatch(updatePurchase(true));
        if (!route.params || !route.params.fromTheme) {
          setTimeout(() => {
            // @ts-ignore
            navigation.pop();
          }, 2000);

          setTimeout(() => {
            // @ts-ignore
            alert(t('iap_purchased_already'));
          }, 3000);
        } else {
          setTimeout(() => {
            // @ts-ignore
            navigation.navigate('SelectAppearance', {});
          }, 2000);
        }
      }
      console.log('purchases', purchases);
    } catch (err: any) {
      console.warn(err);
      console.warn('getPurchases:', err.code, err.message);
    }
  };

  const onPressItem = (item: IProduct, _index: number) => {
    requestPurchase(item.productId);
  };

  const onPressBack = () => {
    navigation.pop();
  };

  if (loading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent={false} backgroundColor={colors.background} />
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onPressBack} />
        <Appbar.Content title={t('iap_navigation_title')} />
      </Appbar.Header>
      <ScrollView style={styles.scrollview}>
        <Text style={[styles.titleText, { color: `${colors.text}cc` }]}>{t('iap_title')}</Text>
        <Text style={[styles.descText, { color: `${colors.text}cc` }]}>{t('iap_desc')}</Text>
        {entries.map((item, index) => {
          return <PurchaseListItem onPress={onPressItem} key={item.id} item={item} index={index} />;
        })}
      </ScrollView>
    </View>
  );
};

export default PurchaseScreen;
