---
name: update-markdown
description: >-
  Use this skill whenever the user types /update-markdown, or asks to update markdown,
  refresh screenshots, compress assets, or synchronize documentation in the KanoAI repository.
---

# KanoAI Markdown & Screenshot Updater

This workflow automatically captures fresh, high-resolution screenshots of the KanoAI web suites, compresses them with `pngquant` and `optipng`, and updates `README.md` to ensure all documentation, preview images, and repository structure are completely synchronized.

## Workflow Steps

### 1. Capture & Compress Screenshots
Execute the automated asset updater script:
```bash
./scripts/update_markdown_assets.sh
```

This script:
- Verifies or starts a local web server on port `8899` serving `docs/`.
- Uses Google Chrome in headless mode (`--window-size=1280,820`) to capture:
  - `docs/assets/preview.png` (Stroke Animator & Kano Audio Suite - Dark Theme)
  - `docs/assets/preview-light.png` (Stroke Animator & Kano Audio Suite - Light Theme)
  - `docs/assets/preview-handwriting.png` (Handwriting Recognition Suite)
- Compresses the images using `pngquant` and `optipng`, reducing total asset size by over 65% while preserving visual clarity.

### 2. Verify Documentation & Repository Structure
Inspect and update [README.md](file://README.md):
- Confirm live demo URLs point to `https://gajjartejas.github.io/KanoAI/` and `https://gajjartejas.github.io/KanoAI/handwriting/`.
- Ensure the preview table displays the updated screenshots side-by-side.
- Ensure bulky character lists (Kakko, Barakhadi, Numbers) are neatly referenced to [`resources/`](file://resources/) rather than inlined.
- Verify the Repository Structure ASCII tree matches the latest repository organization.

### 3. Verification & Git Check
Run `git status` to inspect modified assets and documentation:
```bash
git status
```
Verify that all unit tests still pass:
```bash
cd handwriting && npm test -- --watchAll=false
```
