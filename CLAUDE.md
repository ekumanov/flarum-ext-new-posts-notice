# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# From the js/ directory:
npm run build   # Production build → js/dist/forum.js
npm run dev     # Development watch mode
```

There are no tests or linting configured.

After building, commit the updated `js/dist/` files — they are included in the package.

## Architecture

This is a **frontend-only** Flarum extension. There is no PHP business logic beyond the bootstrap file (`extend.php`), which registers the compiled JS and locale files with Flarum's core.

All functionality lives in `js/src/forum/index.js`. The extension intercepts the `ReplyComposer` lifecycle:

1. **On open** — captures `lastPostNumber()` of the current discussion
2. **On submit** — fetches the latest discussion state from the Flarum store API, computes how many new posts appeared since the composer was opened, and if any exist, presents a confirmation dialog
   - **OK**: submits the reply as normal
   - **Cancel**: minimizes the composer and routes to the first new post

Translations are in `locale/en.yml` under the `ekumanov-new-posts-notice.forum` namespace.

## Flarum API Patterns

- Use `extend` for additive changes (e.g., adding an `onsubmit` handler alongside existing logic)
- Use `override` to replace existing component methods entirely
- Access global Flarum objects via `app.store`, `app.translator`, `app.history`, `app.composer`
- The `flarum-webpack-config` preset handles Babel, externals (Mithril, Flarum core modules), and output paths automatically
