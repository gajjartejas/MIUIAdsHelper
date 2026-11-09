---
name: app-release-workflow
description: Step-by-step workflow for mobile app versioning, release branching, PR creation, merging, and publishing GitHub releases.
---

# Mobile App Release Workflow

This skill defines the mandatory step-by-step workflow for preparing a new mobile release, updating version numbers, creating release PRs, merging to `main`, and publishing GitHub Releases.

---

## 1. Versioning
Update version identifiers across platforms:

- **Android** (`android/app/build.gradle`):
  - Increase `versionName` (e.g., `1.3.0` → `1.4.0` or next minor/patch version).
  - Increment `versionCode` by `+1` (e.g., `23` → `24`).

- **iOS** (`ios/Kano.xcodeproj/project.pbxproj` or `Info.plist`):
  - Set `CFBundleShortVersionString` / `MARKETING_VERSION` = same as Android `versionName` (e.g., `1.4.0`).
  - Reset `CFBundleVersion` / `CURRENT_PROJECT_VERSION` = `1`.

- **Package Config** (`package.json`):
  - Update `"version"` to match the new `versionName` (e.g., `"1.4.0"`).

---

## 2. Branching
- Create a new release branch from up-to-date `main`:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feat--release-<version>
  ```
  - **Example**: `feat--release-1.4.0`

---

## 3. Commit
- Commit version updates with the standard release commit message format:
  ```bash
  git add android/app/build.gradle package.json ios/
  git commit -m "feat(release): release v<version> to playstore"
  ```
  - **Example**: `feat(release): release v1.4.0 to playstore`

---

## 4. Push
- Push the release branch to origin:
  ```bash
  git push -u origin feat--release-<version>
  ```

---

## 5. Issue
- Create a new GitHub issue tracking the release:
  ```bash
  gh issue create --title "Release v<version>" --body "### Summary
- Release version bump to v<version>

### Platform Notes
- **Android**: \`versionName <version>\`, \`versionCode <code+1>\`
- **iOS**: \`CFBundleShortVersionString <version>\`, \`CFBundleVersion 1\`"
  ```

---

## 6. Pull Request
- Create PR from `feat--release-<version>` → `main`:
  - **PR Title**: `feat(release): release v<version> to playstore`
  - **PR Description**: Must include `Closes #<ISSUE_NO>`
  ```bash
  gh pr create --base main --head feat--release-<version> --title "feat(release): release v<version> to playstore" --body "## Description
Release v<version> version bump and release configuration.

Closes #<ISSUE_NO>"
  ```

---

## 7. Merge & Sync
- Merge PR into `main` (prefer squash or merge commit):
  ```bash
  gh pr merge <PR_NO_OR_BRANCH> --squash --delete-branch
  ```
- Switch to `main` and pull latest changes:
  ```bash
  git checkout main
  git pull origin main
  ```

---

## 8. Create GitHub Release
Publish a new GitHub Release for the tag `v<version>` pointing to `main`:

### Option A: Using GitHub CLI (`gh release`)
```bash
gh release create v<version> \
  --target main \
  --title "v<version>" \
  --generate-notes \
  --notes-start "" \
  --notes "## Get the app from Google Play:

<a href=\"https://play.google.com/store/apps/details?id=com.tejasgajjar.kano\">
  <img alt=\"Android app on Google Play\" src=\"https://developer.android.com/images/brand/en_generic_rgb_wo_60.png\" />
</a>"
```

### Option B: Via GitHub Web UI
1. Navigate to **Releases** → **Draft a new release**.
2. **Choose a tag**: `v<version>` (e.g., `v1.4.0`).
3. **Target**: `main`.
4. **Release title**: `v<version>`.
5. Click **Generate release notes** for the automated changelog.
6. Append the Google Play badge markdown at the bottom:
   ```html
   ## Get the app from Google Play:

   <a href="https://play.google.com/store/apps/details?id=com.tejasgajjar.kano">
     <img alt="Android app on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_60.png" />
   </a>
   ```
7. Verify settings:
   - ✅ **Set as the latest release** is enabled.
   - ⬜ **Set as a pre-release** is unchecked.
8. Click **Publish release**.
