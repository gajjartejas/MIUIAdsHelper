# MIUI Ads Helper agent instructions

- Continue work on the branch checked out when the user makes a request. Do not create a new branch, worktree, or separate pull request unless the user explicitly asks.
- When asked to push, push that same branch and update its existing pull request.
- Follow the workspace development and coding rules in `.agents/rules/` when available.
- Do not automatically launch or test with Android emulators on this Hackintosh; emulators do not work reliably here. Use builds, static checks, and automated tests. Leave runtime/device verification for manual testing on a physical device unless the user explicitly requests emulator testing.
