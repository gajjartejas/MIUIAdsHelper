import { finishTransaction, getAvailablePurchases, Purchase, ErrorCode } from 'react-native-iap';
import productIds from 'app/assets/data/purchase-products.json';
import useAppConfigStore from 'app/store/appConfig';
import { withBillingDeadline } from 'app/services/billingDeadline';
import { billingFailure, reportBillingError } from 'app/services/billingDiagnostics';

// Startup, foreground refresh, and purchase-screen restoration share one queue so
// an older asynchronous result cannot overwrite a newer entitlement decision.
let operations: Promise<unknown> = Promise.resolve();
const serialize = <T>(operation: () => Promise<T>): Promise<T> => {
  const next = operations.then(operation, operation);
  operations = next.catch(() => {});
  return next;
};

const isEligible = (purchase: Purchase): boolean =>
  productIds.includes(purchase.productId) && purchase.purchaseState === 'purchased';

const acknowledge = async (purchase: Purchase): Promise<void> => {
  if ('isAcknowledgedAndroid' in purchase && purchase.isAcknowledgedAndroid === true) return;
  await withBillingDeadline(() => finishTransaction({ purchase, isConsumable: false }));
};

export const restorePurchaseEntitlement = (): Promise<boolean> =>
  serialize(async () => {
    // A failed query is not proof of revocation. Preserve cached access offline.
    let purchases: Purchase[];
    try {
      purchases = await withBillingDeadline(() => getAvailablePurchases());
      if (!Array.isArray(purchases)) throw billingFailure(ErrorCode.SyncError);
    } catch (error) {
      reportBillingError('restore', error);
      throw error;
    }
    let entitled = false;
    for (const purchase of purchases) {
      if (!isEligible(purchase)) continue;
      try {
        await acknowledge(purchase);
        entitled = true;
      } catch (error) {
        reportBillingError('acknowledge', error, purchase.productId);
      }
    }
    // A successful empty query (including refunded/revoked items disappearing)
    // clears stale access. Failed acknowledgment never establishes entitlement.
    useAppConfigStore.getState().setPurchased(entitled);
    return entitled;
  }).catch(error => {
    reportBillingError('restore', error);
    throw error;
  });

export const completePurchaseEntitlement = (purchase: Purchase): Promise<boolean> =>
  serialize(async () => {
    if (!isEligible(purchase)) return false;
    try {
      await acknowledge(purchase);
    } catch (error) {
      reportBillingError('acknowledge', error, purchase.productId);
      throw error;
    }
    useAppConfigStore.getState().setPurchased(true);
    return true;
  }).catch(error => {
    reportBillingError('acknowledge', error, purchase?.productId);
    throw error;
  });
