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
- The `flarum-webpack-config` preset handles Babel, externals, and output paths automatically

### Flarum 2.0: lazy-loaded components

`ReplyComposer` lives in a lazy webpack chunk in Flarum 2.0. The `main` branch uses `flarum.reg.onLoad('core', 'forum/components/ReplyComposer', callback)` instead of a top-level import. Do **not** revert this to a top-level import — it will throw `TypeError: Cannot read properties of undefined (reading 'prototype')` at boot.

## Branch / Docker testing rules

Two branches, two Flarum versions:

| Branch | Flarum | webpack-config |
|--------|--------|----------------|
| `main` | 2.0+   | v3 |
| `1.x`  | 1.8    | v2 |

**When switching branches for a build, always run `npm ci` (not `npm install`) from the `js/` directory.** `node_modules` is not tracked by git, so after a branch switch the installed `flarum-webpack-config` version may be wrong. `npm ci` reinstalls exactly what the branch's `package-lock.json` specifies. Building with the wrong config version produces `flarum.reg.get(...)` calls in the dist that crash on the incompatible Flarum version.

**When testing in the Flarum 1.8 Docker (`localhost:80`), both extensions mounted in that container must be on their `1.x` branches:**
- `flarum-ext-new-posts-notice` → `1.x`
- `flarum-ext-inline-audio` → `1.x`

If either is on `main`, its dist will contain `flarum.reg.get(...)` calls that crash the entire JS bundle in Flarum 1.8, silently breaking all extensions.
