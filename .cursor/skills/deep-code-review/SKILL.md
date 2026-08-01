---
name: deep-code-review
description: Reviews code in scope and applies important/medium fixes plus dead-code and duplication removal in the same session. Use when the user asks to review changes, review the diff/PR/branch, look over their code, requests a code review, /deep-code-review, deep review, code audit, or asks to fix review findings — not report-only.
---

# Deep code review

**Fix in place.** Applies to explicit `/deep-code-review` **and** casual requests like “review the changes”, “look over this PR”, or “check my diff”. Review scope, implement fixes, verify, then summarize. A report without code changes is incomplete when important/medium/dead-code issues were in scope.

## Workflow

Copy and track progress:

```
Review progress:
- [ ] Read scope (branch diff, PR, or pointed files) and direct callers/tests
- [ ] Classify each finding: important / medium / low
- [ ] Fix all important, medium, dead code, and improper duplication
- [ ] Run targeted tests and lint on touched files
- [ ] Commit and push if on a PR branch
- [ ] Reply using the output template below
```

**Scope** = current branch changes, open PR diff, or files the user named. Do not expand scope unless needed to fix a finding safely.

## Fix immediately (non-negotiable)

Implement before finishing — never defer these to a follow-up:

| Category | Fix now |
|----------|---------|
| **Dead code** | Unused exports, functions, types, files, imports, unreachable branches, stale post-refactor helpers |
| **Duplication** | Copy-pasted logic, parallel implementations, repeated magic values, duplicate test helpers (extract when used 2+ times in one feature) |
| **Important** | Bugs, security flaws, races, leaks, silent failures, broken error handling, `as any` / unchecked `!`, data-loss risks |
| **Medium** | Misleading names, weak module boundaries, over-engineering, redundant work, scattered constants, tests that only guard implementation details |

**Low** (subjective style, optional refactors): report only, unless trivial (<5 min). When unsure between medium and low → **medium, fix it**.

## Review focus

- **Patterns** — match `.cursorrules`, `.cursor/rules/*.mdc`, `AGENTS.md`; smallest correct diff (DRY, KISS)
- **Security** — auth boundaries, input validation, secrets, injection, unsafe HTML/DOM
- **Reliability** — failure paths fail visibly (`TRPCError`, snackbar, throw, error boundary — match the feature)
- **Concurrency & resources** — stale closures, missing effect/subscription/timer/worker cleanup
- **Tests** — add regression tests for non-trivial behavior fixes; skip tests that duplicate TypeScript or constants

## Verification

- `pnpm exec vitest run <touched-test-paths>` or `pnpm test` when scope is wide
- `pnpm lint` or ESLint on touched files
- Do **not** ship a report-only response when fixes were possible in scope

## Output template

```markdown
## Fixes applied
- [Dead code / dedup / behavior] — what changed and why

## Left unchanged
- [Low-priority or out-of-scope item] — brief rationale

## Verification
- Tests: …
- Lint: …
```

Use code citations for non-obvious changes. Keep prose concise.

## Example

**Finding:** `windTurbulence.ts` exports Perlin noise used only for a tiny drift term on top of sine flutter.

**Action:** Delete file; replace with `sparkFlutter.ts`; centralize constants in `sparkParticlePhysics.ts`; update tests.

**Response excerpt:**
> **Fixes applied** — Removed 80-line Perlin module (dead weight). Consolidated spark constants and motion profiles. Fixed double-resolve in padding helper.
>
> **Verification** — 64 domDisintegrate tests pass; ESLint clean on touched files.
