import { withBillingDeadline } from '../app/services/billingDeadline';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('clears the timer after a successful operation', async () => {
  await expect(withBillingDeadline(async () => true)).resolves.toBe(true);
  expect(jest.getTimerCount()).toBe(0);
});

it('bounds a hung native operation and ignores its late result', async () => {
  let finish!: (value: string) => void;
  const result = withBillingDeadline(
    () =>
      new Promise<string>(resolve => {
        finish = resolve;
      }),
  );
  const assertion = expect(result).rejects.toMatchObject({ code: 'service-timeout' });
  await jest.advanceTimersByTimeAsync(15000);
  await assertion;
  finish('late result');
  expect(jest.getTimerCount()).toBe(0);
});

it('clears its timer after an operation rejects', async () => {
  await expect(
    withBillingDeadline(async () => {
      throw new Error('Failed');
    }),
  ).rejects.toThrow('Failed');
  expect(jest.getTimerCount()).toBe(0);
});
