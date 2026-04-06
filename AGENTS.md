<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

Good starting points in the bundle:

- `01-app/02-guides/ai-agents.md` — agent setup and doc layout
- `01-app/01-getting-started/` — App Router basics
- `01-app/03-api-reference/` — APIs and file conventions

<!-- END:nextjs-agent-rules -->

## dStruct (this repo)

**Precedence:** The section above is the source of truth for **Next.js** (framework APIs, App Router, `next.config`, version-specific behavior). **`.cursor/rules/`** is the source of truth for **this repo's code style and patterns**. If bundled Next.js docs or generic examples disagree with a Cursor rule—hook imports, type imports, comment conventions—**follow the Cursor rule** for code in this repository.

Cursor rules to apply (see each file for full wording):

- `react-named-hook-imports.mdc` — named hook imports from `"react"`; no `React.use*` for hooks
- `no-inline-type-imports.mdc` — no inline `import()` in type positions; use top-level `import type`
- `no-one-letter-identifiers.mdc` — no single-letter variables/parameters (ESLint `id-length`)
- `useeffect-business-logic-comments.mdc` — short comments above non-trivial `useEffect` hooks that encode business logic

**Tooling:** Use **pnpm** for installs and scripts (`pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm test`). Local dev: `pnpm dev`. Prefer iterating with the dev server rather than repeated full production builds during exploration.

**Project rules:** See **`.cursorrules`** for stack, architecture, tRPC/Redux boundaries, styling (MUI + Emotion, no Tailwind), testing conventions, and feature workflow. **`.cursor/rules/*.mdc`** adds always-on style rules (React hook imports, type imports, `useEffect` comments).

## Cursor Cloud specific instructions

### Services overview

| Service | Command | Notes |
|---|---|---|
| Next.js dev server | `pnpm dev` | Runs on `http://localhost:3000`. Core app (frontend + tRPC API). |
| PostgreSQL | `sudo service postgresql start` | Must be running before dev server or any DB commands. |
| Python runner (optional) | `pnpm runners:dev` | Only needed for server-side Python code execution. |

### Node.js version

The project requires **Node.js 24** (`engines.node: "^v24.11.1"` in `package.json`). Use `nvm use 24` before running any commands. The `.nvmrc` file is set to `24`.

### Database

- PostgreSQL with user `dstruct`, password `dstruct`, database `dstruct` on `localhost:5432`.
- After starting PostgreSQL, push the schema with `pnpm prisma:push`.
- To seed with sample data: `SKIP_ENV_VALIDATION=true PRISMA_FIELD_ENCRYPTION_KEY=dev-local-encryption-key-for-testing-only DATABASE_URL=postgresql://dstruct:dstruct@localhost:5432/dstruct pnpm loadMainDump`.

### Environment variables

- A `.env` file must exist at the repo root. See `.env.example` for the template.
- Many env vars (OAuth, AWS) are validated at startup but can use placeholder values for local dev since those features won't be exercised.
- Set `SKIP_ENV_VALIDATION=true` to bypass env validation for scripts and tests.
- The `PRISMA_FIELD_ENCRYPTION_KEY` value is a passphrase (not the old `k1.aesgcm256.*` format); any non-empty string works for local dev.

### Key development commands

Refer to `package.json` scripts. Summary of most-used:

- **Dev server**: `pnpm dev`
- **Lint**: `pnpm lint` (runs ESLint + TypeScript `--noEmit`)
- **Tests**: `pnpm test` or `pnpm test:ci` (both run Vitest once); `pnpm test:watch` for watch mode
- **Prisma generate**: `pnpm prisma:generate` (auto-run by `postinstall`)
- **GraphQL codegen**: `pnpm generate-graphql` (auto-run by `postinstall`)

### Gotchas

- The `/api/config` endpoint uses `@vercel/edge-config` which requires Vercel's `EDGE_CONFIG` env var. It returns 404 locally but the app handles this gracefully — the playground still works fully.
- The `postinstall` script runs `prisma:generate`, `generate-graphql`, creates a Python venv, and installs `black`. Ensure `python3-venv` is installed on the system.
- `pnpm typesafe-i18n` is a **file watcher** that never exits. Do not run it in a blocking terminal session; run in background or skip.
- Pre-commit hook runs `prettier --write` via `lint-staged`. Pre-push hook runs `pnpm lint`.
