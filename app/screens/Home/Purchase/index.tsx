import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PurchaseListItem, { IProduct } from 'app/components/PurchaseListItem';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

//App Modules
import styles from './styles';
import useInappPurchases from 'app/config/inapp-purchases';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import useAppConfigStore from 'app/store/appConfig';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';
import crashlytics from '@react-native-firebase/crashlytics';

type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Purchase'>;

const Purchase = ({ navigation, route }: Props) => {
  //Const
  const iaps = useInappPurchases();
  const { colors } = useTheme<AppTheme>();
  const { t } = useTranslation();
  const setPurchased = useAppConfigStore(state => state.setPurchased);

  //States
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<(IProduct & PurchasesPackage)[]>([]);

  const handlePurchase = useCallback(
    (message: string) => {
      setPurchased(true);
      if (!route.params || !route.params.fromTheme) {
        navigation.pop();
        setTimeout(() => {
          Alert.alert(message);
        }, 500);
      } else {
        navigation.navigate('SelectAppearance', {});
      }
    },
    [navigation, route.params, setPurchased],
  );

  const restorePurchases = useCallback(async () => {
    try {
      const purchases = await Purchases.restorePurchases();
      if (!purchases || purchases.allPurchasedProductIdentifiers.length < 1) {
        return;
      }
      handlePurchase(t('iap_purchased_already'));
      console.log('Purchase->purchases', purchases);
    } catch (e: any) {
      console.error('Purchase->restorePurchases:', e);
      crashlytics().recordError(e, 'Purchase->restorePurchases');
    }
  }, [handlePurchase, t]);

  const getItems = useCallback(async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        const products = offerings.current.availablePackages;
        const mappedEntries: (IProduct & PurchasesPackage)[] = products.map(anObj1 => ({
          ...iaps.find(anObj2 => anObj1.identifier === anObj2.productId)!,
          ...anObj1,
        }));
        setEntries(mappedEntries);
      }
    } catch (e: any) {
      console.error('Purchase->getItems:', e);
      Alert.alert(e.message);
      crashlytics().recordError(e, 'Purchase->getItems');
    }
  }, [iaps]);

  useEffect(() => {
    try {
      restorePurchases()
        .then(() => {
          return getItems();
        })
        .then(() => {
          console.log('getItems done');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err: any) {
      console.warn('Purchase->err:', err.code, err.message);
      Alert.alert(err.message);
    }
  }, [getItems, restorePurchases]);

  const requestAppPurchase = useCallback(
    async (item: IProduct & PurchasesPackage) => {
      try {
        const purchasePackageResponse = await Purchases.purchasePackage(item);
        console.log('Purchase->purchasePackageResponse:', JSON.stringify(purchasePackageResponse));
        const customerInfo = purchasePackageResponse.customerInfo;
        if (typeof customerInfo.entitlements.active.pro !== 'undefined') {
          navigation.pop();
          handlePurchase(t('iap_purchased_success'));
        }
      } catch (e: any) {
        if (e.code !== Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          console.error('Purchase->requestAppPurchase:', e.code, e.message);
          Alert.alert(e.message);
          crashlytics().recordError(e, 'Purchase->requestAppPurchase');
        }
      }
    },
    [handlePurchase, navigation, t],
  );

  const onPressItem = useCallback(
    (item: IProduct & PurchasesPackage, _index: number) => {
      requestAppPurchase(item);
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
