<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## dStruct (this repo)

**Precedence:** The section above is the source of truth for **Next.js** (framework APIs, App Router, `next.config`, version-specific behavior). **`.cursor/rules/`** is the source of truth for **this repo's code style and patterns**. If bundled Next.js docs or generic examples disagree with a Cursor rule—hook imports, type imports, comment conventions—**follow the Cursor rule** for code in this repository.

Cursor rules to apply (see each file for full wording):

- `react-named-hook-imports.mdc` — named hook imports from `"react"`; no `React.use*` for hooks
- `no-inline-type-imports.mdc` — no inline `import()` in type positions; use top-level `import type`
- `no-one-letter-identifiers.mdc` — no single-letter variables/parameters except `_` (discard) and `i`/`j`/`k` for classic `for` loops (ESLint `id-length`)
- `i18n-english-fallback-locales.mdc` — new strings only in `en`; other locales use `{ ...en, ...overrides }`, no English copies for fallback
- `useeffect-business-logic-comments.mdc` — short comments above non-trivial `useEffect` hooks that encode business logic

**Tooling:** Use **pnpm** for installs and scripts (`pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm test`). Local dev: `pnpm dev`. Prefer iterating with the dev server rather than repeated full production builds during exploration.

**Project rules:** See **`.cursorrules`** for stack, architecture, tRPC/Redux boundaries, styling (MUI + Emotion, no Tailwind), testing conventions, and feature workflow. **`.cursor/rules/*.mdc`** adds always-on style rules (React hook imports, type imports, `useEffect` comments).

### Instant Navigations (Next.js 16.3) — not on Pages Router yet

dStruct is **mostly Pages Router** (`src/pages/`). An **App Router pilot** lives under `src/app/internal-marketing/[locale]/` (home, privacy, daily; noindex). **Instant Navigations** (`cacheComponents`, `partialPrefetching`, `'use cache'`, `unstable_instant`, Instant Insights) requires broader App Router migration. Do not enable `cacheComponents` or add `'use cache'` under `src/pages/`.

Before implementing Instant Navigations, read:

- `vibe-docs/Instant-Navigations-Design.md` — phased migration plan (i18n, Vercel 16.3 gate, route priorities)
- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`
- `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`

**16.3 on Vercel:** stay on the pinned `next` version in `package.json` until preview `/api/*` routes return correct `x-matched-path` (not `/en/404`). See design doc Phase 1.

**Pilot order when migrating:** marketing routes (`/`, `/privacy`, `/daily`) under `app/[lang]/` before `/playground`.

## Cursor Cloud specific instructions

### Services overview

| Service            | Command                         | Notes                                                                        |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------- |
| Next.js dev server | `pnpm dev`                      | Runs on `http://localhost:3000`. Core app (frontend + tRPC API).             |
| PostgreSQL         | `sudo service postgresql start` | Auto-started + provisioned by the startup update script; use this command only if it is not already running. |
| Python in the app  | (none)                          | Python runs in the browser via Pyodide (workers); no separate Python server. |

### Node.js version

The project requires **Node.js 24** (`engines.node: "^v24.11.1"` in `package.json`; `.nvmrc` is `24`). In this environment **`node` already resolves to v24 by default** — just run `node`, `pnpm`, `pnpm dev`, etc. directly. No `nvm use` step is needed.

**Gotcha (do not "fix" this):** the command runner injects `/exec-daemon` (which ships its own Node **v22**) at the front of `PATH` on every shell, so `nvm use 24` does **not** win and `pnpm`'s `#!/usr/bin/env node` shebang would otherwise pick v22. This is worked around during environment setup by placing `node`/`npm`/`npx`/`corepack`/`pnpm` shims in `/usr/local/cargo/bin` (which sits ahead of `/exec-daemon` in `PATH`) pointing at the nvm-managed Node 24. These shims live in the snapshot; if `node --version` ever reports v22, recreate them from `~/.nvm/versions/node/v24.*/bin`.

### Database

- PostgreSQL with user `dstruct`, password `dstruct`, database `dstruct` on `localhost:5432`.
- **The startup update script already installs (if missing), starts, and provisions this** — it creates the `dstruct` role/db, ensures `.env`, and runs `pnpm prisma:push` + `pnpm loadMainDump` only when the DB is empty. On a normal boot the DB is already up and seeded, so you should not need to run anything manually.
- Manual re-provision if needed: start PostgreSQL, push the schema with `pnpm prisma:push`.
- To (re)seed with sample data: `SKIP_ENV_VALIDATION=true PRISMA_FIELD_ENCRYPTION_KEY=dev-local-encryption-key-for-testing-only DATABASE_URL=postgresql://dstruct:dstruct@localhost:5432/dstruct pnpm loadMainDump`.
- **Why the update script provisions PostgreSQL (do not slim it back down to just `pnpm install`):** a prior startup script that only ran `sudo service postgresql start` hard-failed with `postgresql: unrecognized service` on fresh VMs where the DB was not present, which marked setup as failed. The update script is therefore idempotent and self-healing: every step is guarded and best-effort so it never aborts pod startup, and all steps short-circuit when the snapshot already has PostgreSQL + data.

### Public playground dump (`public-dumps/main.json`)

- **`pnpm loadMainDump`** upserts everything in that file into the DB pointed at by **`DATABASE_URL`**. Running it against prod **overwrites** matching rows by id, so anything only in the file and not in prod can be lost if you do not refresh the file first.
- **Refresh the file from prod (recommended before shipping dump changes or before loading to prod after prod edits):** point **`DATABASE_URL`** at production (or use a prod read replica), then run **`pnpm sync-main-dump`**. That runs `dumpAllProjects` with **`--public-only`**, rewriting **`public-dumps/main.json`** with only **`isPublic`** playground projects and their test cases and solutions.
- **Full DB export** (all projects, not only public): `pnpm dumpAllProjects` (writes `public-dumps/main.json` when using `--rewrite` without `--public-only`).
- **Custom output path:** `pnpm run load-env -- cross-env NODE_ENV=development tsx src/scripts/dumpAllProjects.ts --rewrite --public-only --out /path/to/main.json`

### Environment variables

- A `.env` file must exist at the repo root. See `.env.example` for the template.
- Many env vars (OAuth, AWS) are validated at startup but can use placeholder values for local dev since those features won't be exercised.
- Set `SKIP_ENV_VALIDATION=true` to bypass env validation for scripts and tests.
- The `PRISMA_FIELD_ENCRYPTION_KEY` value is a passphrase (not the old `k1.aesgcm256.*` format); any non-empty string works for local dev.

### Key development commands

Refer to `package.json` scripts. Summary of most-used:

- **Dev server**: `pnpm dev`
- **Sync public dump from DB**: `pnpm sync-main-dump` (with `DATABASE_URL` set; exports `isPublic` projects to `public-dumps/main.json`)
- **Lint**: `pnpm lint` (runs ESLint + TypeScript `--noEmit`)
- **Tests**: `pnpm test` or `pnpm test:ci` (both run Vitest once); `pnpm test:watch` for watch mode
- **E2E (Playwright)**: `pnpm test:e2e` — local run starts `pnpm dev` + Postgres; set `PLAYWRIGHT_BASE_URL` to hit a remote preview (skips dev server). CI runs automatically on each successful Vercel preview via `.github/workflows/e2e-preview.yml` (`deployment_status` → `PLAYWRIGHT_EXPECT_MATCHED_PATH=true`).
- **Preview smoke (CLI)**: `PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app PLAYWRIGHT_EXPECT_MATCHED_PATH=true pnpm preview-smoke` — fast merge-gate (HTTP status + API `x-matched-path`). Protected previews: set `VERCEL_AUTOMATION_BYPASS_SECRET` (same GitHub secret as CI e2e; Vercel → Deployment Protection → Protection Bypass for Automation).
- **Prisma generate**: `pnpm prisma:generate` (auto-run by `postinstall`)
- **GraphQL codegen**: `pnpm generate-graphql` (auto-run by `postinstall`). **CI**: run `pnpm run ci:init` after `pnpm install` (same as postinstall). **Vercel**: `vercel.json` runs `pnpm run ensure-generated-from-install` after install when gitignored `src/graphql/generated` may be missing from cache.

### Fonts (Pages Router)

- **App UI:** Inter (body / default MUI typography) and Space Grotesk (headings `h1`–`h4`, `subtitle2`, app bar wordmark) load via **`next/font/google`** in `src/shared/fonts/appFonts.ts`. `pages/_document.tsx` sets `className={fontVariableClassNames}` on `<Html>` (so variables inherit to `body`). **`pages/_app.tsx` must import `#/shared/fonts/appFonts`** as well — `_document` is server-only, so without that import the client bundle never gets the `@font-face` / variable rules and `var(--font-app-*)` stays undefined. **Do not** add a duplicate Google Fonts stylesheet for those families.
- **Stacks:** use `appFontStackSans` / `appFontStackDisplay` from `src/shared/fonts/fontVariables.ts` in theme or `sx` so names stay aligned with the loader. In `appFonts.ts`, the `next/font` `variable` option must stay **string literals** (Turbopack does not accept imported constants there).
- **Material Icons** still use the Google Fonts icon stylesheet in `_document.tsx` (separate from text fonts).
- **Code samples** (e.g. landing preview) intentionally use a **monospace** stack, not Inter.

Bundled Next.js reference: `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` (includes Pages Router `_app` examples for `next/font`).

### Gotchas

- The `/api/config` endpoint uses `@vercel/edge-config` which requires Vercel's `EDGE_CONFIG` env var. It returns 404 locally but the app handles this gracefully — the playground still works fully.
- The `postinstall` script runs `prisma:generate`, `generate-graphql`, creates a Python venv, and installs `black`. Ensure `python3-venv` is installed on the system. **`.env` with `DATABASE_URL` must exist before `pnpm install`** because `prisma generate` (via `prisma.config.ts`) requires it at postinstall time.
- `pnpm typesafe-i18n` is a **file watcher** that never exits. Do not run it in a blocking terminal session; run in background or skip.
- Pre-commit hook runs `prettier --write` via `lint-staged`. Pre-push hook runs `pnpm lint`.
