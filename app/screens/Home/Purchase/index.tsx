import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  getAvailablePurchases,
  fetchProducts,
  requestPurchase,
  ErrorCode,
  ProductOrSubscription,
  PurchaseError,
  initConnection,
  finishTransaction,
} from 'react-native-iap';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';

//App Modules
import styles from './styles';
import PurchaseListItem, { IProduct } from 'app/components/PurchaseListItem';
import useInappPurchases from 'app/config/inapp-purchases';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import useAppConfigStore from 'app/store/appConfig';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';
import crashlytics from 'app/services/crashlytics';
import analytics from 'app/services/analytics';
import { showAppDialog } from 'app/store/dialogStore';

const itemSkus = [
  'com.tejasgajjar.miuiadshelper.item1',
  'com.tejasgajjar.miuiadshelper.item2',
  'com.tejasgajjar.miuiadshelper.item3',
  'com.tejasgajjar.miuiadshelper.item4',
];

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Purchase'>;

const Purchase = ({ navigation, route }: Props) => {
  //Constants
  const { fromTheme } = route.params;
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const iaps = useInappPurchases();
  const setPurchased = useAppConfigStore(state => state.setPurchased);

  //States
  const [entries, setEntries] = useState<IProduct[]>(iaps);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const navigatePostPurchase = useCallback(() => {
    if (fromTheme) {
      navigation.navigate('SelectAppearance');
    } else {
      navigation.navigate('HomeTabs', { screen: 'DashboardTab' });
    }
  }, [fromTheme, navigation]);

  const handlePurchase = useCallback(
    (message: string) => {
      setPurchased(true);
      analytics().logEvent('iap_purchase_flow_complete', {
        fromTheme: Boolean(fromTheme),
      });
      showAppDialog(
        '',
        message,
        [
          {
            text: 'OKAY',
            onPress: navigatePostPurchase,
          },
        ],
        {
          onDismiss: navigatePostPurchase,
        },
      );
    },
    [fromTheme, navigatePostPurchase, setPurchased],
  );

  const onResetDevPurchases = useCallback(async () => {
    try {
      setIsProcessing(true);
      setProcessingMessage('Resetting & consuming test purchases...');
      await initConnection();
      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        for (const purchase of purchases) {
          try {
            await finishTransaction({ purchase, isConsumable: true });
          } catch (consumeErr) {
            console.warn('Purchase->onResetDevPurchases->consumeErr:', consumeErr);
          }
        }
      }
      setPurchased(false);
      setIsProcessing(false);
      showAppDialog(
        'DEV: Test Purchases Consumed',
        'All purchases have been consumed and released in Google Play. You can now test purchasing any item again.',
      );
    } catch (e: unknown) {
      setIsProcessing(false);
      console.error('DEV consume error:', e);
      showAppDialog('DEV Reset Error', String(e));
    }
  }, [setPurchased]);

  const restorePurchase = useCallback(async () => {
    try {
      await initConnection();
      const purchases = await getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        for (const purchase of purchases) {
          if ('isAcknowledgedAndroid' in purchase && !purchase.isAcknowledgedAndroid) {
            try {
              await finishTransaction({ purchase, isConsumable: false });
            } catch (ackError) {
              console.warn('Purchase->restorePurchase->ackError:', ackError);
            }
          }
        }
        handlePurchase(t('iap_purchased_already'));
      }
      console.log('Purchase->purchases:', purchases);
    } catch (e: unknown) {
      console.error('Purchase->restorePurchase:', e);
      crashlytics().recordError(e, 'Purchase->restorePurchase->error');
    }
  }, [handlePurchase, t]);

  const getItems = useCallback(async () => {
    try {
      await initConnection();
      const products = await fetchProducts({ skus: itemSkus });
      if (products && products.length > 0) {
        const mappedEntries: IProduct[] = products.map((anObj1: ProductOrSubscription) => {
          const matchingConfig = iaps.find(anObj2 => anObj1.id === anObj2.productId);
          const displayPrice = 'displayPrice' in anObj1 ? anObj1.displayPrice || '' : '';
          return {
            ...matchingConfig!,
            displayPrice,
            localizedPrice: displayPrice,
            id: matchingConfig?.id ?? 0,
            productId: anObj1.id,
          };
        });
        setEntries(mappedEntries);
      } else {
        setEntries(iaps);
      }
    } catch (e: unknown) {
      console.error('Purchase->getItems:', e);
      setEntries(iaps);
      crashlytics().recordError(e, 'Purchase->getItems->error');
    }
  }, [iaps]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await restorePurchase();
        await getItems();
      } catch (e: unknown) {
        console.error('Purchase->init:', e);
        crashlytics().recordError(e, 'Purchase->init->error');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [getItems, restorePurchase]);

  const requestAppPurchase = useCallback(
    async (sku: string) => {
      try {
        setIsProcessing(true);
        setProcessingMessage('Connecting to Google Play Store...');
        await initConnection();
        const purchaseResult = await requestPurchase({
          type: 'in-app',
          request: {
            google: {
              skus: [sku],
            },
            apple: {
              sku: sku,
            },
          },
        });
        setIsProcessing(false);
        console.log('Purchase->requestAppPurchase:', purchaseResult);
      } catch (e: unknown) {
        setIsProcessing(false);
        console.error('Purchase->requestAppPurchase:', e);
        const purchaseError = e as PurchaseError;
        if (purchaseError.code === ErrorCode.AlreadyOwned) {
          if (__DEV__) {
            showAppDialog(
              'DEV: Item Already Owned',
              'Google Play indicates this item is already owned by your test account. Would you like to consume and reset it now to test purchasing again?',
              [
                {
                  text: 'Cancel',
                  onPress: () => handlePurchase(t('iap_purchased_already')),
                },
                {
                  text: 'Reset / Consume',
                  onPress: async () => {
                    await onResetDevPurchases();
                  },
                },
              ],
            );
            return;
          }
          handlePurchase(t('iap_purchased_already'));
        } else if (purchaseError.code !== ErrorCode.UserCancelled) {
          const message = purchaseError.message || 'Purchase error';
          showAppDialog(message);
          crashlytics().recordError(e, 'Purchase->requestAppPurchase->error');
        }
      }
    },
    [handlePurchase, onResetDevPurchases, t],
  );

  const onPressItem = useCallback(
    (item: IProduct, _index: number) => {
      requestAppPurchase(item.productId);
    },
    [requestAppPurchase],
  );

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
        RightViewComponent={
          __DEV__ ? (
            <Button
              mode="text"
              compact
              textColor={colors.error || '#DC143C'}
              onPress={onResetDevPurchases}>
              DEV Reset
            </Button>
          ) : null
        }
      />
      <ScrollView style={styles.scrollview}>
        <Text style={[styles.titleText, { color: `${colors.text}cc` }]}>{t('iap_title')}</Text>
        <Text style={[styles.descText, { color: `${colors.text}cc` }]}>{t('iap_desc')}</Text>
        {entries.map((item, index) => {
          return <PurchaseListItem onPress={onPressItem} key={item.id} item={item} index={index} />;
        })}
        {__DEV__ && (
          <View style={{ margin: 16, marginTop: 24, alignItems: 'center' }}>
            <Button
              mode="outlined"
              textColor={colors.error || '#DC143C'}
              onPress={onResetDevPurchases}>
              Reset / Consume Test Purchases (DEV)
            </Button>
          </View>
        )}
      </ScrollView>
      <Components.ProcessingOverlay visible={isProcessing} message={processingMessage} />
    </Components.AppBaseView>
  );
};

export default Purchase;
