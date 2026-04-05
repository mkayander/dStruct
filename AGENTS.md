<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

Good starting points in the bundle:

- `01-app/02-guides/ai-agents.md` — agent setup and doc layout
- `01-app/01-getting-started/` — App Router basics
- `01-app/03-api-reference/` — APIs and file conventions

<!-- END:nextjs-agent-rules -->

## dStruct (this repo)

**Precedence:** The section above is the source of truth for **Next.js** (framework APIs, App Router, `next.config`, version-specific behavior). **`.cursor/rules/`** is the source of truth for **this repo’s code style and patterns**. If bundled Next.js docs or generic examples disagree with a Cursor rule—hook imports, type imports, comment conventions—**follow the Cursor rule** for code in this repository.

Cursor rules to apply (see each file for full wording):

- `react-named-hook-imports.mdc` — named hook imports from `"react"`; no `React.use*` for hooks
- `no-inline-type-imports.mdc` — no inline `import()` in type positions; use top-level `import type`
- `useeffect-business-logic-comments.mdc` — short comments above non-trivial `useEffect` hooks that encode business logic

**Tooling:** Use **pnpm** for installs and scripts (`pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm test`). Local dev: `pnpm dev`. Prefer iterating with the dev server rather than repeated full production builds during exploration.
