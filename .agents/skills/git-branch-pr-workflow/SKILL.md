---
name: git-branch-pr-workflow
description: Standard step-by-step workflow for Git branching, committing, pushing, creating GitHub issues, creating PRs, merging, syncing main, and cleanup.
---

# Git Branch, Issue, PR & Merge Workflow

This skill defines the mandatory step-by-step workflow for creating branches, committing changes, creating issues and pull requests, merging, and syncing branches.

---

## 1. Branching
- Create a new branch from up-to-date `main`, if branch name is other than main, then do not create new branch:
  ```bash
  git checkout -b <prefix>--<short-description>
  ```
  - **Prefix Conventions**:
    - `feat--<short-description>`: For new features or feature enhancements
    - `fix--<short-description>`: For bug fixes or crash resolutions
    - `chore--<short-description>`: For maintenance, dependencies, configs, or build scripts
    -  Note: `short-description` should match actual issue.

---

## 2. Changes
- Make the required code changes.
- Ensure all quality checks pass (lint, type-checking, tests).

---

## 3. Commit
- Always pull and rebase from `main` branch.
- Commit using Conventional Commits format with a short and meaningful message:
  ```bash
  git add <files>
  git commit -m "<type>(<scope>): <short description>"
  ```
  - **Examples**:
    - `feat(settings): add gujarati font preview`
    - `fix(android): resolve soloader libc++_shared missing DSO crash`
    - `chore(deps): bump dependencies`
    - Note: `short-description` should match actual issue.

---

## 4. Push
- Push branch to origin:
  ```bash
  git push -u origin <prefix>--<short-description>
  ```

---

## 5. Issue
- Create a new GitHub issue if the issue does not exists, if issue exists then ignore it:
  ```bash
  gh issue create --title "<Short description of work>" --body "### Summary
- What is implemented/fixed

### Context & Notes
- Relevant context, logs, or reproduction details"
  ```

---

## 6. Pull Request
- Create PR from `<prefix>--<short-description>` → `main`:
  - **PR Title**: Same as commit message
  - **PR Description**: Must include `Closes #<ISSUE_NO>` (or `Fixes #<ISSUE_NO>`) to auto-close the issue after merge.
  ```bash
  gh pr create --base main --head <prefix>--<short-description> --title "<Commit Message>" --body "## Description
<Summary of changes>

Closes #<ISSUE_NO>"
    ```

Most Important for step #7 and #8:
Never Merge Pull request instead inform to manually do below #7 and #8


---

## 7. Review & Merge
- Merge PR (prefer squash merge to keep history clean for release notes):
  ```bash
  gh pr merge <PR_NO_OR_BRANCH> --squash --delete-branch
  ```

---

## 8. Sync Local
- Switch to main branch:
  ```bash
  git checkout main
  ```
- Pull latest changes:
  ```bash
  git pull origin main
  ```

---

## 9. Cleanup (Optional)
- Delete local branch:
  ```bash
  git branch -d <prefix>--<short-description>
  ```
- Delete remote branch (if not deleted during merge):
  ```bash
  git push origin --delete <prefix>--<short-description>
  ```
