import { ErrorCode } from 'react-native-iap';
import productIds from 'app/assets/data/purchase-products.json';
import crashlytics from 'app/services/crashlytics';

export type BillingStage = 'connect' | 'catalog' | 'restore' | 'acknowledge' | 'request' | 'listener' | 'disconnect';
const recentReports = new Map<string, number>();
const reportedErrors = new WeakSet<object>();

const field = (error: unknown, name: string): unknown => {
  if (typeof error !== 'object' || error === null) return undefined;
  try {
    return Reflect.get(error, name);
  } catch {
    return undefined;
  }
};

export const billingCode = (error: unknown): ErrorCode => {
  const code = field(error, 'code');
  return Object.values(ErrorCode).includes(code as ErrorCode) ? (code as ErrorCode) : ErrorCode.Unknown;
};

export const expectedBillingOutcome = (error: unknown): boolean =>
  [ErrorCode.UserCancelled, ErrorCode.AlreadyOwned, ErrorCode.Pending, ErrorCode.DeferredPayment].includes(
    billingCode(error),
  );

export const billingFailure = (code: ErrorCode): Error => Object.assign(new Error(`Billing: ${code}`), { code });

/** Only allow known enum values, numeric response codes, and our own SKUs to Firebase.
 * Native messages/debugMessage, receipts, tokens, order IDs, and error objects are never uploaded.
 */
export const reportBillingError = (stage: BillingStage, error: unknown, productId?: string): boolean => {
  if (expectedBillingOutcome(error)) return false;
  if (typeof error === 'object' && error !== null && reportedErrors.has(error)) return false;
  const code = billingCode(error);
  const candidate = productId ?? field(error, 'productId');
  const product = typeof candidate === 'string' && productIds.includes(candidate) ? candidate : 'unknown';
  const response = field(error, 'responseCode');
  const subResponse = field(error, 'subResponseCodeAndroid');
  const numeric = (value: unknown) => (typeof value === 'number' && Number.isSafeInteger(value) ? value : null);
  const reason =
    typeof subResponse === 'string' &&
    ['no-applicable-sub-response-code', 'payment-declined-due-to-insufficient-funds', 'user-ineligible'].includes(
      subResponse,
    )
      ? subResponse
      : null;
  const errorName = field(error, 'name');
  const errorType =
    typeof errorName === 'string' && ['TypeError', 'RangeError', 'SyntaxError', 'Error'].includes(errorName)
      ? errorName
      : 'Error';
  const details = { stage, code, product, response: numeric(response), subResponse: reason, errorType };
  // The request promise and native listener may both report the same failure.
  const source = stage === 'request' || stage === 'listener' ? 'checkout' : stage;
  const key = JSON.stringify({ ...details, stage: source });
  const now = Date.now();
  const last = recentReports.get(key);
  if (last !== undefined && now - last < 5000) return false;
  if (recentReports.size >= 32) recentReports.clear();
  try {
    const tracker = crashlytics();
    tracker.log(`IAP ${JSON.stringify(details)}`);
    tracker.recordError(new Error(`IAP ${JSON.stringify(details)}`), `IAP_${stage}_${code}`);
    recentReports.set(key, now);
    if (typeof error === 'object' && error !== null) reportedErrors.add(error);
    return true;
  } catch {
    // Diagnostics must never interrupt checkout or restoration.
    return false;
  }
};
