import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View, Alert } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PurchaseListItem, { IProduct } from 'app/components/PurchaseListItem';
import { useTranslation } from 'react-i18next';
import {
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getProducts,
  ProductPurchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  Sku,
} from 'react-native-iap';
import { useTheme } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';

//App Modules
import styles from './styles';
import useInappPurchases from 'app/config/inapp-purchases';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import useAppConfigStore from 'app/store/appConfig';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';

const itemSkus = [
  'com.tejasgajjar.miuiadshelper.item1',
  'com.tejasgajjar.miuiadshelper.item2',
  'com.tejasgajjar.miuiadshelper.item3',
  'com.tejasgajjar.miuiadshelper.item4',
];

let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;

type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Purchase'>;

const Purchase = ({ navigation, route }: Props) => {
  //Const
  const iaps = useInappPurchases();
  const { colors } = useTheme<AppTheme>();
  const { t } = useTranslation();
  const setPurchased = useAppConfigStore(state => state.setPurchased);

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
      endConnection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initPurchase = async () => {
    try {
      await getPurchases();

      await getItems();

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }
    } catch (err: any) {
      console.warn(err.code, err.message);
      // @ts-ignore
      Alert.alert(err.message);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: ProductPurchase) => {
      console.info('purchaseUpdatedListener->purchase', purchase);
      const receipt = purchase.transactionReceipt;
      console.info('purchaseUpdatedListener->receipt', receipt);
      if (receipt) {
        try {
          const ackResult = await finishTransaction({ purchase, isConsumable: false });
          console.info('purchaseUpdatedListener->ackResult', ackResult);
          setPurchased(true);
          Alert.alert(t('iap_purchased_success'));
          navigation.pop();
        } catch (ackErr: any) {
          console.warn('purchaseUpdatedListener->ackErr', ackErr);
          Alert.alert(ackErr.message);
        }
      } else {
        console.warn('purchaseUpdatedListener->receipt->not found');
      }
    });

    purchaseErrorSubscription = purchaseErrorListener(error => {
      console.log('purchaseErrorListener', error);
      Alert.alert(error.message);
    });
  };

  const getItems = async () => {
    try {
      const products = await getProducts({ skus: itemSkus });
      let mappedEntries: IProduct[] = products.map(anObj1 => ({
        ...iaps.find(anObj2 => anObj1.productId === anObj2.productId)!,
        ...anObj1,
      }));
      setEntries(mappedEntries);
    } catch (err: any) {
      console.warn('getItems:', err.code, err.message);
      Alert.alert(err.message);
    }
  };

  // Version 3 apis
  const requestAppPurchase = async (sku: Sku) => {
    try {
      let purchaseResult = await requestPurchase({ skus: [sku] });
      console.log('purchaseResult', purchaseResult);
    } catch (err: any) {
      console.warn('requestAppPurchase:', err.code, err.message);
      Alert.alert(err.message);
    }
  };

  const getPurchases = async () => {
    try {
      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        setPurchased(true);
        setTimeout(() => {
          navigation.replace(route.params.route, route.params.params);
        }, 1000);
      }
      console.log('purchases', purchases);
    } catch (err: any) {
      console.warn(err);
      console.warn('getPurchases:', err.code, err.message);
    }
  };

  const onPressItem = (item: IProduct, _index: number) => {
    requestAppPurchase(item.productId);
  };

  const onGoBack = () => {
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
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('iap_navigation_title')}
        style={{ backgroundColor: colors.background }}
      />
      <ScrollView style={styles.scrollview}>
        <Text style={[styles.titleText, { color: `${colors.text}cc` }]}>{t('iap_title')}</Text>
        <Text style={[styles.descText, { color: `${colors.text}cc` }]}>{t('iap_desc')}</Text>
        {entries.map((item, index) => {
          return <PurchaseListItem onPress={onPressItem} key={item.id} item={item} index={index} />;
        })}
      </ScrollView>
    </Components.AppBaseView>
  );
};

export default Purchase;
