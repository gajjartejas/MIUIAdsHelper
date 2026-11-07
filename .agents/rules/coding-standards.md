---
trigger: always_on
---

# Coding Standards & Guidelines

## 1. Color System & Theming
- **All Colors Must Be Declared in Theme**:
  - All UI colors, accents, borders, card surfaces, and badges must come from the app theme (`useTheme<AppTheme>().colors.<token>`).
  - Definitions reside in `app/models/theme/index.ts` and `app/config/app-theme-config.ts` (`ExtendedMD3Theme` / `AppColors`).
  - **No single static color code** (e.g. `#FFFFFF`, `#6366F1`, `#E2E8F0`, `#F1F5F9`, `black`) is permitted inside screen or component files or style sheets.
- **No Static Color Comparisons**:
  - Never compare hex values against static strings (e.g. `currentHex.toUpperCase() === '#FFFFFF'`). The theme handles light/dark variants natively.
- **No Unnecessary Default Fallbacks**:
  - Do not add arbitrary fallback defaults when data properties are already guaranteed or typed (e.g. avoid `item.hex || '#6366F1'`).

## 2. Localization & i18n
- **No Redundant `defaultValue` in Translation Calls**:
  - Translation keys must be defined in both `app/locales/en.json` and `app/locales/gu.json`.
  - Do not pass `{ defaultValue: '...' }` to `t(...)` calls (e.g. use `t('colorDetailScreen.playSound')` instead of `t('colorDetailScreen.playSound', { defaultValue: 'Play Sound' })`).

## 3. Data Architecture & External Assets JSON
- **No Hardcoded App Content in Code Files**:
  - App content data (vocabulary items, examples, sentences, parts of speech, categories, translations) must NOT be declared as static objects or arrays inside `.ts` or `.js` screen/data files (e.g. never place static sentence mappings in `colorsData.ts`).
  - All content data must reside in `.json` files inside `app/assets/` (e.g. `app/assets/lang/sections/colors.json`, `app/assets/lang/vowels/vowels.json`, etc.).
  - TypeScript modules should only import the JSON files and expose typed interfaces and utility accessors.

## 4. React Hooks & Component Architecture
- **Direct Hook Imports**:
  - Always import hooks directly from `'react'` (e.g. `import { useEffect, useCallback, useMemo, useState, useRef } from 'react';`).
  - Never use namespace hook references like `React.useEffect` or `React.useCallback`.
- **Timer Management & Auto-Cleanup Hook**:
  - Prefer the shared `useTimeout` hook (`app/hooks/useTimeout.ts`) for all delayed actions and screen transitions.
  - `useTimeout` automatically cancels previous pending timers before rescheduling and clears timers on unmount.
  - If a raw `setTimeout` or `setInterval` is strictly required, always store it in a `useRef`, clear it before scheduling anew, and provide unmount cleanup in `useEffect`.
- **Performance & Memoization**:
  - Wrap event handlers and callbacks in `useCallback`.
  - Memoize derived datasets, computed metrics, layouts, and lists with `useMemo`.
  - Wrap standalone list/grid cell items with `React.memo` where applicable.

## 5. Assets & SVG Artwork
- **SVG Files Over Inline JSX Artwork**:
  - Always store SVG artwork, illustrations, icons, and mascot graphics as `.svg` files in `app/assets/images/` or `app/assets/svgs/`.
  - Never create or maintain large inline JSX SVG components (with hundreds of raw `<Path>`, `<Circle>`, `<Svg>` tags directly in `.tsx` files).
  - Import `.svg` files directly as components (e.g. `import MascotGirlCheering from 'app/assets/images/mascot_girl_cheering.svg'`) powered by `react-native-svg-transformer`.

## 6. App Asset Management & Platform Distribution (`assets/` & `post-install.js`)
- **Canonical Asset Root (`Kano/assets/`)**:
  - All static media assets (audio, SVGs, images, fonts) must reside in `Kano/assets/` organized by type and section:
    - `assets/audio/<section>/` (e.g. `assets/audio/colors/`, `assets/audio/numbers/`, `assets/audio/barakhadi/`)
    - `assets/svgs/<section>/` (e.g. `assets/svgs/numbers/`, `assets/svgs/barakhadi/`)
    - `assets/images/<section>/`
    - `assets/fonts/`
  - Never commit or generate media files directly into native platform folders (`android/app/src/main/res/raw` or `ios/assets/`) without placing them in `assets/` first.
- **Automated Platform Sync (`post-install.js`)**:
  - `Kano/post-install.js` is the authoritative script that synchronizes all assets from `assets/` to both platforms on `npm install` / `npm run postinstall`:
    - **iOS**: Preserves section hierarchy under `./ios/assets/<type>/<section>/...`
    - **Android Audio**: Synchronizes into `./android/app/src/main/res/raw/` (flattened with `audio_` prefix and lowercase naming).
    - **Android SVGs/Fonts/Images**: Synchronizes into `./android/app/src/main/assets/...`
  - When authoring or generating assets for any section, always save them to `Kano/assets/<type>/<section>/` and run `node ./post-install.js`.

## 7. Rounded Cards on Android
- Paint the entire rounded card surface, including its selection state, without an inset rectangular layer. On Android, resolve translucent theme tints against the screen background to an opaque card color before applying elevation; translucent elevated surfaces can expose rectangular composition artifacts.
- Put elevation and shadow on an outer rounded wrapper without `overflow: 'hidden'`. Clip the full-size touch surface to the same radius, and give it the same opaque color as the wrapper so no edge or inner rectangle appears.
- Never remove or disable an existing ripple, opacity response, animation, or other UI effect to fix a visual defect unless the user explicitly asks to remove that effect. Preserve its color, intensity, timing, and interaction behavior while correcting its bounds or layer placement.
- For rounded selectable cards, place `TouchableRipple` on the full rounded card surface with matching border radius and clipping. For draggable cards that require an outer gesture view, make the inner touch target fill the card's content bounds and move layout padding inside it. Avoid an inset touch or opacity layer that can reveal a rectangle after a press.
- Do not set a transparent `backgroundColor` on an inner `View` or `Svg`; omit the background style. In particular, do not construct transparent colors by appending `00` to a theme color.
- When changing one card family, scan sibling card components for the same nested surface pattern. Check idle, pressed, selected, matched, and error states, and verify that the ripple and other feedback still appear, including on an Android 16 device when available.

