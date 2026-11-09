import { ErrorCode } from 'react-native-iap';
import { billingFailure } from 'app/services/billingDiagnostics';

// A hung native read/acknowledgment must not leave the UI or entitlement queue
// blocked indefinitely. This timer belongs to the operation and is always cleared.
// Never use this to time out or automatically retry a payment authorization sheet.
export const withBillingDeadline = async <T>(operation: () => Promise<T>): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation(),
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(billingFailure(ErrorCode.ServiceTimeout)), 15000);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
};
