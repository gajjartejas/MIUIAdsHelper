import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PurchaseListItem, { IProduct } from 'app/components/PurchaseListItem';
import { useTranslation } from 'react-i18next';
import { getAvailablePurchases, getProducts, requestPurchase, Sku, ErrorCode } from 'react-native-iap';
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
import crashlytics from '@react-native-firebase/crashlytics';

const itemSkus = [
  'com.tejasgajjar.miuiadshelper.item1',
  'com.tejasgajjar.miuiadshelper.item2',
  'com.tejasgajjar.miuiadshelper.item3',
  'com.tejasgajjar.miuiadshelper.item4',
];

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

  const handlePurchase = useCallback(
    (message: string) => {
      setPurchased(true);
      if (!route.params || !route.params.fromTheme) {
        setTimeout(() => {
          navigation.pop();
        }, 2000);

        setTimeout(() => {
          Alert.alert(message);
        }, 3000);
      } else {
        setTimeout(() => {
          navigation.navigate('SelectAppearance', {});
        }, 2000);
      }
    },
    [navigation, route.params, setPurchased],
  );

  const restorePurchase = useCallback(async () => {
    try {
      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        handlePurchase(t('iap_purchased_already'));
      }
      console.log('Purchase->purchases:', purchases);
    } catch (e: any) {
      console.error('Purchase->restorePurchase:', e);
      crashlytics().recordError(e, 'Purchase->restorePurchase->error');
    }
  }, [handlePurchase, t]);

  const getItems = useCallback(async () => {
    try {
      const products = await getProducts({ skus: itemSkus });
      const mappedEntries: IProduct[] = products.map(anObj1 => ({
        ...iaps.find(anObj2 => anObj1.productId === anObj2.productId)!,
        ...anObj1,
      }));
      setEntries(mappedEntries);
    } catch (e: any) {
      console.error('Purchase->getItems:', e);
      Alert.alert(e.message);
      crashlytics().recordError(e, 'Purchase->getItems->error');
    }
  }, [iaps]);

  useEffect(() => {
    (async () => {
      try {
        await restorePurchase();

        await getItems();

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (e: any) {
        console.error('useEffect:', e);
        crashlytics().recordError(e, 'Purchase->useEffect->error');
        Alert.alert(e.message);
      }
    })();
  }, [getItems, restorePurchase]);

  const requestAppPurchase = useCallback(
    async (sku: Sku) => {
      try {
        let purchaseResult = await requestPurchase({ skus: [sku] });
        console.log('Purchase->requestAppPurchase:', purchaseResult);
      } catch (e: any) {
        console.error('Purchase->requestAppPurchase:', e);
        crashlytics().recordError(e, 'Purchase->requestAppPurchase->error');
        if (e.code === ErrorCode.E_ALREADY_OWNED) {
          handlePurchase(t('iap_purchased_already'));
        } else if (e.code !== ErrorCode.E_USER_CANCELLED) {
          Alert.alert(e.message);
        }
      }
    },
    [handlePurchase, t],
  );

  const onPressItem = useCallback(
    (item: IProduct, _index: number) => {
      requestAppPurchase(item.productId);
    },
    [requestAppPurchase],
  );

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
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
