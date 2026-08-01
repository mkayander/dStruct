---
name: deep-code-review
description: Deep code review that applies important and medium fixes plus dead-code removal in the same session
disable-model-invocation: true
---

# Deep code review

Review the code in scope (the current branch, PR diff, or files the user pointed at) and **apply fixes in this same session**. A review that only lists issues without implementing fixes is incomplete.

## Non-negotiable: fix immediately

**Always implement in code before you finish** — do not defer to a follow-up unless the item is explicitly low-priority (see below):

1. **Dead code** — unused exports, functions, types, constants, files, imports, commented-out blocks, unreachable branches, stale helpers left after a refactor.
2. **Improper duplication** — copy-pasted logic that should be shared; parallel implementations of the same behavior; magic numbers/strings repeated across files; test helpers duplicated instead of extracted when used in 2+ places in the same feature.
3. **Important issues** — bugs, incorrect behavior, security flaws, race conditions, memory/event leaks, silent failure paths, broken error handling, type-safety holes (`as any`, unchecked `!`), data-loss risks.
4. **Medium issues** — misleading names, poor module boundaries, over-engineered abstractions, missing validation on failure paths, tests that only assert implementation details, redundant double work (e.g. resolving options twice), constants scattered instead of centralized.

If you find dead or duplicated code, **delete or consolidate it in this turn**. Do not leave it “for later” and do not only mention it in the summary.

## Severity guide

| Severity | Examples | Action |
|----------|----------|--------|
| **Important** | Bugs, security, leaks, races, silent failures | **Fix now** + add/regression test when behavior is non-trivial |
| **Medium** | DRY violations, misnamed modules, dead exports, weak structure, redundant logic | **Fix now** |
| **Low** | Subjective style, micro-naming, optional refactors with no clear win | Report only; skip unless trivial (<5 min) |

When unsure between medium and low, **treat it as medium and fix it**.

## Review checklist

Evaluate against:

- **DRY, KISS, SOLID** — prefer the smallest correct change; match existing repo patterns (see `.cursorrules`, `.cursor/rules/*.mdc`, `AGENTS.md`).
- **Security** — auth boundaries, input validation, secrets, injection, unsafe HTML/DOM.
- **Reliability** — no silent failures; error paths must fail visibly (throw, `TRPCError`, snackbar, error boundary — match the feature’s established pattern).
- **Concurrency** — race conditions, stale closures, missing cleanup in effects/subscriptions/timers/workers.
- **Resources** — event listeners, intervals, observers, workers, object URLs revoked on unmount/teardown.
- **Types** — no `as any` / unchecked `!`; fix root cause instead of suppressing.
- **Tests** — add or update tests when fixing behavior or preventing regression; skip tests that only duplicate TypeScript or constants.

## Required workflow

1. **Read** the changed files and their direct callers/tests.
2. **Identify** issues; classify as important / medium / low.
3. **Fix** all important and medium issues plus all dead/duplicated code **before** writing the final summary.
4. **Run** targeted tests and lint on touched files (`pnpm test`, `pnpm lint` as appropriate).
5. **Commit and push** if working on a branch with an open PR.

Do **not** end with only a bullet list of recommendations when important/medium/dead-code fixes were possible in scope.

## Output format

Structure the final response as:

1. **Fixes applied** — what you changed and why (group dead-code removal, deduplication, and behavioral fixes).
2. **Left unchanged** — only low-priority or out-of-scope items, with brief rationale.
3. **Verification** — tests/lint run and results.

Keep prose concise; prefer code citations for non-obvious changes.
