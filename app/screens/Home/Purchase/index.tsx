import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ErrorCode, ProductOrSubscription } from 'react-native-iap';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';

import styles from './styles';
import PurchaseListItem, { IProduct } from 'app/components/PurchaseListItem';
import useInappPurchases from 'app/config/inapp-purchases';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';
import { showAppDialog } from 'app/store/dialogStore';
import { restorePurchaseEntitlement } from 'app/services/purchaseEntitlements';
import { connectBilling, loadBillingProducts, requestBillingPurchase } from 'app/services/billing';
import { billingCode } from 'app/services/billingDiagnostics';

type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Purchase'>;

const Purchase = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const configured = useInappPurchases();
  const mounted = useRef(true);
  const busy = useRef(false);
  const [products, setProducts] = useState<ProductOrSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const entries = useMemo(
    () =>
      configured.flatMap(item => {
        const product = products.find(value => value.id === item.productId);
        if (!product || !('displayPrice' in product) || !product.displayPrice) return [];
        return [{ ...item, displayPrice: product.displayPrice }];
      }),
    [configured, products],
  );

  const loadCatalog = useCallback(async () => {
    if (mounted.current) setLoading(true);
    try {
      const available = await loadBillingProducts();
      if (mounted.current) setProducts(available);
    } catch {
      if (mounted.current) setProducts([]);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadCatalog();
    (async () => {
      try {
        await connectBilling();
        if (mounted.current) await restorePurchaseEntitlement();
      } catch {
        // Failures are reported by the shared billing service; catalog retry remains available.
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, [loadCatalog]);

  const restore = useCallback(async () => {
    await connectBilling();
    return restorePurchaseEntitlement();
  }, []);

  const onRestore = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setRestoring(true);
    try {
      const entitled = await restore();
      if (mounted.current) showAppDialog(t(entitled ? 'iap_purchased_already' : 'iap_no_purchases'));
    } catch {
      if (mounted.current) showAppDialog(t('iap_purchase_not_verified'));
    } finally {
      busy.current = false;
      if (mounted.current) setRestoring(false);
    }
  }, [restore, t]);

  const onPressItem = useCallback(
    async (item: IProduct) => {
      if (busy.current) return;
      busy.current = true;
      setProcessing(true);
      try {
        await requestBillingPurchase(item.productId);
      } catch (error) {
        if (!mounted.current) return;
        const code = billingCode(error);
        if (code === ErrorCode.AlreadyOwned) {
          try {
            const entitled = await restore();
            if (mounted.current) showAppDialog(t(entitled ? 'iap_purchased_already' : 'iap_purchase_not_verified'));
          } catch {
            if (mounted.current) showAppDialog(t('iap_purchase_not_verified'));
          }
        } else if (code === ErrorCode.Pending || code === ErrorCode.DeferredPayment) {
          showAppDialog(t('iap_pending'));
        } else if (code !== ErrorCode.UserCancelled) {
          showAppDialog(t('iap_purchase_not_verified'));
        }
      } finally {
        busy.current = false;
        if (mounted.current) setProcessing(false);
      }
    },
    [restore, t],
  );

  const goBack = useCallback(() => navigation.pop(), [navigation]);
  const disabled = processing || restoring;

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AppHeader
        showBackButton
        onPressBackButton={goBack}
        title={t('iap_navigation_title')}
        style={{ backgroundColor: colors.background }}
      />
      <ScrollView style={styles.scrollview}>
        <Text style={[styles.titleText, { color: colors.text }]}>{t('iap_title')}</Text>
        <Text style={[styles.descText, { color: colors.onSurfaceVariant }]}>{t('iap_desc')}</Text>
        {loading ? (
          <ActivityIndicator />
        ) : entries.length > 0 ? (
          entries.map((item, index) => (
            <PurchaseListItem
              key={item.productId}
              item={item}
              index={index}
              onPress={onPressItem}
              disabled={disabled}
            />
          ))
        ) : (
          <View style={styles.recovery}>
            <Text style={[styles.recoveryText, { color: colors.onSurfaceVariant }]}>
              {t('iap_catalog_unavailable')}
            </Text>
            <Button mode="outlined" onPress={loadCatalog} disabled={disabled}>
              {t('iap_retry')}
            </Button>
          </View>
        )}
        <Button mode="text" onPress={onRestore} loading={restoring} disabled={disabled || loading}>
          {t('iap_restore')}
        </Button>
      </ScrollView>
      <Components.ProcessingOverlay visible={processing} message={t('iap_connecting')} />
    </Components.AppBaseView>
  );
};

export default Purchase;
