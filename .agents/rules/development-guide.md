---
trigger: always_on
---

# Kano Development Guide

Kano is a React Native Gujarati-learning app. Run application commands from the `Kano/` application directory. This guide applies to the mobile app repository and its `app/` source tree.

## Repository Map

- `app/Entrypoint.tsx` composes the app providers: gesture handling, safe areas, Realm, app configuration, and navigation.
- `app/screens/` contains feature screens, normally paired with a nearby `styles.ts` or `styles.tsx` file.
- `app/components/` contains reusable UI. Prefer an existing component before adding a similar one; use `Components` from `app/components` where that barrel already exports the component.
- `app/navigation/` owns the stack/tab registration and all route parameter types.
- `app/store/` contains persisted Zustand settings backed by `app/store/zustandStorage.ts` (MMKV).
- `app/realm/` owns Realm schemas, CRUD helpers, and migrations.
- `app/assets/lang/` contains learning datasets; `app/locales/` contains interface translations; `app/config/` owns app-wide asset, font, link, and Lottie registries.
- `app/models/` contains domain, view-model, and theme types.

## Commands and Quality Gate

- Use Node `>=22.11.0` and npm. Do not hand-edit `package-lock.json` unless dependency changes require it.
- Run `npm run lint` for changed TypeScript/TSX. ESLint treats unused imports as errors; unused variables are warnings only when deliberately prefixed with `_`.
- Run `npm test -- --runInBand` for behaviour, store, data, or asset changes. The project uses Jest with React Native mocks and supports the `app/*` import alias.
- Format with the committed Prettier configuration: single quotes, trailing commas, no parentheses around one-argument arrows, and 120-column print width.
- Do not modify generated Android/iOS build output, copied platform assets, or secrets/configuration files unless the request explicitly requires it.

## TypeScript, Imports, and Component Conventions

- Keep TypeScript types explicit at public boundaries: component props, hook returns, route params, persisted store state/actions, Realm data, and JSON adapters. Do not introduce `any`; prefer `unknown` plus narrowing when input is untrusted.
- Use the `app/*` alias for app code. Preserve the local import grouping used throughout the app: React/React Native, third-party packages, then app modules.
- Import React hooks directly from `react`; do not use `React.useEffect`, `React.useCallback`, and similar namespace calls.
- Use `React.FC` only when it adds clarity; otherwise type props directly. Keep components focused and use `React.memo` for reusable leaf/list cells when their props are stable.
- Wrap event handlers, navigation actions, and callbacks passed to memoized children in `useCallback`. Use `useMemo` for derived lists, grouped data, layouts, and expensive computations. Include all real dependencies.
- Prefer named constants and descriptive interfaces over positional or magic values. Comments should explain non-obvious product or platform rationale, not repeat code.

## UI, Layout, and Accessibility

- Build screens with the shared primitives first: `AppBaseView` for safe-area/scrolling layouts, `AppHeader` for headers, `CommonIcon` for icons, and the established list/grid/card components where suitable.
- When `AppHeader` renders the status-bar inset, omit the `top` edge from its surrounding `AppBaseView` so the header is not pushed down twice. Match nearby screens before changing header spacing.
- When a UI or style issue asks one screen to match another, inspect the reference screen and reuse its existing components and layout. Extract a shared component and stylesheet when the screens have the same structure; keep only their content, data, and navigation separate. Avoid copying styles into parallel screen files that can drift apart.
- Keep primary screen actions in a bottom safe-area footer when the action should remain visible while content scrolls. Reuse the feature's button radius, height, typography, and horizontal alignment; avoid giving sibling screens separate copies of the same action styles.
- Apply horizontal screen padding once. Do not stack equal outer-scroll and inner-card padding that makes a detail screen narrower than its sibling screen. Check the usable pane width when a tablet sidebar is shown.
- Show an explanatory empty state beside zero-progress trackers so unfilled dots or bars are not mistaken for missing data.
- Keep static layout in the screen/component `styles` file with `StyleSheet.create`. Apply theme- or item-dependent values alongside the component using style arrays; do not duplicate whole style objects inline.
- Treat phones, tablets, and rotation as supported layouts. Use `useLargeScreenMode`, `useActualDimensions`, and `useSafeAreaInsets` where applicable rather than assuming one device size.
- For screenshot-driven UI fixes, check card dimensions, horizontal and vertical gaps, typography, colors, and safe-area behavior in portrait and landscape. If a temporary screenshot is unavailable, continue from the named in-app reference and report that visual comparison could not be completed.
- For Android card rendering fixes, inspect the card in idle, pressed, selected, and completed states. Check that the background reaches the rounded border without a rectangular patch around the content, and confirm that existing ripple, opacity, and animation feedback still work. Do not remove an effect unless the user asks. Verify on the reported Android version when a device is available; otherwise state that visual verification is pending.
- Give interactive controls an accessibility role and a meaningful localized label when an icon or visual treatment alone would not describe the action. Preserve touch targets and safe-area padding.
- Use the configured Gujarati font families from `Config.Fonts` or `useGujaratiFont` for Gujarati text. Do not invent font-family strings.
- In compact cards, check Gujarati glyphs with every selectable font family. Leave enough line height and top padding for tall glyphs, including when `numberOfLines` and font fitting are used; avoid synthetic `fontWeight` when an explicit font file already provides that weight.

## Theme and Color System

- All UI colors, accents, borders, surfaces, shadows, and badges in components and screen styles must come from `useTheme<AppTheme>().colors` or from a typed, runtime item color. Add app-wide tokens in both `app/models/theme/index.ts` and `app/config/app-theme-config.ts`, with light and dark values.
- Do not place static color literals or compare hardcoded hex strings in screen/component/style files. Theme config is the one source for UI palette values.
- Domain color values are an exception: a learning color item's `hex` belongs in its JSON dataset and flows through the typed item. Never use an arbitrary fallback where the model guarantees that field.
- Respect the persisted appearance/accent selection in `app/store/themeConfig.ts`; do not bypass it by selecting a Paper or navigation theme locally.

## Localization and Learning Data

- All user-facing interface copy must use `useTranslation()` and a key present in both `app/locales/en.json` and `app/locales/gu.json`. Do not pass `defaultValue` to `t()`.
- Keep learning content—characters, vocabulary, examples, translations, audio/SVG paths, categories, and color metadata—in JSON under `app/assets/lang/`, not as static screen arrays or maps. TypeScript modules may import JSON, expose typed accessors, and derive display data from it.
- Keep JSON schema changes synchronized with `app/models/models/*` and relevant adapters. Preserve stable IDs, counts, asset paths, and category values unless the requested content migration intentionally changes them.
- Add or update the colocated dataset test when changing a learning JSON file. Validate the metadata, item count, required fields, and referenced SVG/audio asset paths as appropriate.

## State, Persistence, and Asynchronous Work

- Put durable app preferences in a focused Zustand store using the existing `persist`, `devtools`, and `zustandStorage` pattern. Separate state from actions and keep persisted values serializable.
- Use per-field store selectors to limit re-renders. Do not introduce a second persistence mechanism for settings already served by MMKV/Zustand.
- Keep progress and structured learning records in Realm. Schema changes require updates to `app/realm/modals/`, CRUD helpers when needed, and an explicit migration path in `app/realm/migration.ts`; never rely on `deleteRealmIfMigrationNeeded` outside development.
- Prefer `useTimeout` for delayed UI work and transitions. If a raw timer is unavoidable, retain it in a ref, cancel before rescheduling, and clean it up on unmount. Release native resources such as sounds in effect cleanup.
- Keep network/native failures observable through the established Crashlytics/error pattern, and avoid logging user content or sensitive values.

## Navigation, Analytics, and Assets

- Add every route and its complete parameter type to `app/navigation/types.ts`, then register it in the appropriate navigator in `app/navigation/HomeTabNavigator.tsx`. Use typed `NativeStackScreenProps`, `NativeStackNavigationProp`, and `RouteProp` in screens; do not navigate with untyped route names or params.
- The root navigation container already records screen views. Keep route parameters analytics-safe primitives only and do not add personal, learning-answer, or raw content payloads to analytics.
- Register raster images in `app/config/images.ts`, fonts in `app/config/fonts.ts`, Lottie files in `app/config/lotties.ts`, and public links in `app/config/app-constant.ts` rather than scattering paths and URLs across screens.
- Store reusable artwork as SVG files under `app/assets/images/` (or `app/assets/svgs/`) and import them as transformed components. Do not add large inline JSX SVG drawings.
- Canonical static assets (audio, SVGs, images, fonts) must be placed in `Kano/assets/` organized by type and section (e.g., `assets/audio/<section>/`, `assets/svgs/<section>/`). Never commit or generate media files directly into native platform folders (`android/app/src/main/res/raw` or `ios/assets/`). Run `node ./post-install.js` (or `npm run postinstall`) to synchronize assets from `assets/` into both native platform targets.
- When adding an SVG or another asset type, update Metro/Jest handling only if the existing transformer or mock cannot load it.

## Scope Discipline

- Make the smallest cohesive change that follows these boundaries and preserve existing, unrelated working-tree changes.
- Do not opportunistically refactor legacy code solely because it predates these rules. Apply the rules to touched/new code and call out any necessary follow-up separately.
- Continue application work on the Git branch that was checked out when the user made the request. Do not create a new branch or worktree, or open a separate PR, unless the user explicitly asks for one. When the user asks to push, push that same branch and update its existing PR.
