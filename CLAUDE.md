# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@mini-dev/hook` is a small library that lets a miniapp (WeChat/Alipay/Douyin, etc.) intercept and decorate the `App`, `Page`, and `Component` constructor options — adding shared `before`/`after`/`afterReturn`/`afterThrow` behavior (e.g. default share config, logging) around any lifecycle or custom method without modifying each page's code. It's built on top of `object-hook` (a separate npm package, declared as a peer/regular dependency).

The entire library is `libs/index.js` (~45 lines). Read it directly rather than searching — there is no other implementation surface.

## Commands

- Run tests: `npm test` (runs `jest` against `tests/hook.test.js`)
- Run a single test: `npx jest -t "<test name>"`
- No build step — `libs/index.js` is shipped as-is (`main`/`miniprogram` both point at `libs`).
- No lint/format scripts are wired into `package.json`; `.eslintrc.cjs` (`eslint:recommended`) and `.prettierrc.json` (4-space indent, single quotes, semicolons, printWidth 180) exist for editor integration only — run `npx eslint .` / `npx prettier --check .` directly if needed.

## Architecture

### Core (`libs/index.js`)

- `create(constructor)` wraps a miniapp constructor function (`App`, `Page`, `Component`, or a custom pre-wrapped variant) and returns a new callable `$Constructor` with:
  - `.use(decoration)` — pushes a decoration object onto `$Constructor.stack`. A decoration maps option paths (e.g. `onLoad`, `'methods.onTap'`) to builder functions `(hostInstance) => ({ before, after, afterReturn, afterThrow })`. Multiple `.use()` calls compose in order.
  - `.mount(name, host)` — installs the wrapped constructor as a non-writable, configurable property on `host` (defaults to `globalThis`), so miniapp files can call the global `App`/`Page`/`Component` directly without importing the wrapper.
  - `.create` — re-exposes the module-level `create`, so a wrapped constructor can itself be wrapped again (layering hooks on hooks; see `sample-hook-wechat/app/index.js` where a hand-rolled `DefaultApp`/`DefaultPage`/`DefaultComponent` layer sits under the `object-hook`-based layer).
  - Calling `$Constructor(option)` runs `option` through every decoration in `stack` via `object-hook`'s `hook()`, then passes the fully-hooked option to the original constructor.
- The library exports three ready-made wrappers, `_App`, `_Page`, `_Component`, pre-created from the global `App`/`Page`/`Component`.
- `hook()` is created with `{ allowMissing: true, allowCreate: true }`: hooking a path that doesn't exist on the option object (e.g. `onShareAppMessage` when the page never defines it) creates it, so a hook builder can act as a global fallback for optional lifecycle methods. If a builder returns `false`/`null`/`undefined`, that path is skipped entirely (no method is created) — used to let individual pages opt out of a global default (see `shareMode` handling in the samples).

### Samples (`sample-hook-wechat/`, `sample-hook-alipay/`, `sample-hook-douyin/`)

Full miniapp projects (one per platform) that consume `@mini-dev/hook` via `file:..` or version-pinned dependency, demonstrating:
- Layering a custom wrapper (`DefaultApp`/`DefaultPage`/`DefaultComponent` in `app/index.js`) underneath the hook-based wrapper.
- Global share-message fallback with per-page override/opt-out (`pages/new-page-customshare-*`, `pages/new-page-noshare-*`).
- `.mount()` usage via a `?mode=mount` launch query param in `app.js`, to demonstrate replacing global `Page`/`Component` so individual page files don't need to import the wrapper.

These sample projects are excluded from the published npm package (`.npmignore`: `sample*`) and are for local manual testing in each platform's devtools, not automated tests — they have no real test scripts of their own.

## Testing conventions

`tests/hook.test.js` stubs `global.App`/`global.Page`/`global.Component` as `jest.fn((option) => option)` before each test and re-requires `../libs` via `jest.resetModules()` — this is necessary because `_App`/`_Page`/`_Component` are captured from the global constructors at module-load time. Follow this pattern (`loadLibrary()` helper) when adding tests that depend on the pre-built `_App`/`_Page`/`_Component` exports rather than `create()` directly.
