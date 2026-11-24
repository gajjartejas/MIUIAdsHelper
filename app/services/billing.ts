import { fetchProducts, initConnection, requestPurchase, ErrorCode, ProductOrSubscription } from 'react-native-iap';
import productIds from 'app/assets/data/purchase-products.json';
import { withBillingDeadline } from 'app/services/billingDeadline';
import {
  billingCode,
  billingFailure,
  isRetryableBillingRead,
  reportBillingError,
} from 'app/services/billingDiagnostics';

let connecting: Promise<void> | undefined;
let loadingProducts: Promise<ProductOrSubscription[]> | undefined;
let requesting = false;

export const connectBilling = (): Promise<void> => {
  if (!connecting) {
    connecting = (async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (!(await withBillingDeadline(() => initConnection()))) throw billingFailure(ErrorCode.InitConnection);
          return;
        } catch (error) {
          reportBillingError('connect', error);
          if (attempt === 0 && isRetryableBillingRead(error)) continue;
          throw error;
        }
      }
    })().finally(() => {
      connecting = undefined;
    });
  }
  return connecting;
};

export const loadBillingProducts = (): Promise<ProductOrSubscription[]> => {
  if (!loadingProducts) {
    loadingProducts = (async () => {
      for (let attempt = 0; ; attempt++) {
        await connectBilling();
        try {
          const products = await withBillingDeadline(() => fetchProducts({ skus: productIds, type: 'in-app' }));
          const available = (products ?? []).filter(
            product => productIds.includes(product.id) && 'displayPrice' in product && Boolean(product.displayPrice),
          );
          if (!available.length) throw billingFailure(ErrorCode.ItemUnavailable);
          return available;
        } catch (error) {
          reportBillingError('catalog', error);
          // A timeout can leave a native query running. Do not start an overlapping query.
          if (attempt === 0 && billingCode(error) !== ErrorCode.ServiceTimeout && isRetryableBillingRead(error))
            continue;
          throw error;
        }
      }
    })().finally(() => {
      loadingProducts = undefined;
    });
  }
  return loadingProducts;
};

export const requestBillingPurchase = async (sku: string): Promise<void> => {
  // Acquire synchronously: React state alone cannot prevent two rapid taps.
  if (requesting) return;
  requesting = true;
  try {
    if (!productIds.includes(sku)) throw billingFailure(ErrorCode.ItemUnavailable);
    await connectBilling();
    // Never automatically retry a payment request. Success is handled only by
    // the purchase listener after a completed transaction is acknowledged.
    await requestPurchase({ type: 'in-app', request: { google: { skus: [sku] }, apple: { sku } } });
  } catch (error) {
    reportBillingError('request', error, sku);
    throw error;
  } finally {
    requesting = false;
  }
};
