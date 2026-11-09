# Android billing verification

The billing flow uses Google Play one-time non-consumable products. A device needs a working, supported Play Store, an eligible account, and products available to that account. An app-side change cannot make billing available on devices without Google Play or override payment declines and regional restrictions.

## Automated coverage

Run `npm test -- --runInBand`, `npm run lint`, and `./node_modules/.bin/tsc --noEmit` from the app directory.

Tests cover connection failures and bounded retries, concurrent taps, unavailable/unpriced products, cancellation, pending payment, AlreadyOwned restoration, acknowledgment failures, refunded purchases disappearing, offline cache preservation, stalled native reads, and diagnostic redaction/deduplication.

## Firebase diagnostics

Handled billing failures are recorded as **non-fatal Firebase Crashlytics errors**. Search error names beginning with `IAP_`, such as `IAP_acknowledge_network-error` or `IAP_catalog_item-unavailable`. The error message and `IAP` log entry contain:

- Stage: connect, catalog, restore, acknowledge, request, listener, or disconnect.
- Standard SDK error code and JavaScript error type.
- Google Play response/subresponse codes when provided.
- A recognized product ID from this app's configured catalog, or `unknown`.

Raw native messages/debug messages, error payloads, receipts, purchase tokens, order IDs, and custom device identifiers are excluded. Cancellation, pending/deferred payments, and AlreadyOwned are expected outcomes, not non-fatal errors. A failed restoration or acknowledgment is still reported. Duplicate reports from a request and its listener are suppressed briefly.

Crashlytics automatically supplies its standard app/device context. Reporting failures do not interrupt checkout. Reports are queued by Firebase and delivery depends on its collection settings and connectivity. Debug reporting is disabled in `firebase.json`; verify delivery with an internal-testing release, rather than assuming a mocked unit test proves upload.

## Internal testing before production

Install the correctly signed release from Google Play internal testing using a license tester. Verify each configured product is active and available in that tester's country.

1. Complete a test purchase. Confirm the appearance entitlement unlocks only after completed payment and acknowledgment.
2. Cancel checkout. Confirm no success dialog, no unlocked entitlement, and no stuck spinner.
3. Use a pending/slow test payment method. Confirm the pending message appears, access remains locked, and completion is recovered when the app resumes.
4. Reinstall or switch to another supported Android device with the same Play account. Confirm restoration without another purchase.
5. Refund/revoke a test purchase. On the next successful store query, confirm cached entitlement is removed.
6. Disable connectivity or simulate billing service errors. Confirm retries are bounded, cached access is preserved on a failed query, and Retry/Restore controls work after reconnecting.
7. Use Play Billing Lab's response simulator for connection, item-unavailable, developer/configuration, network, and acknowledgment errors. Confirm the matching stage/code appears as a non-fatal in Firebase Crashlytics after upload.
8. Check a Xiaomi/HyperOS device and another Play-certified Android device, including app background/resume, rotation, and rapid taps. Check unsupported/no-Play devices fail cleanly with no purchasable placeholder rows.

The current local release build is separately blocked by its unavailable configured Android SDK 37 and debug-key release-signing configuration. Resolve those before producing the internal-testing release.
