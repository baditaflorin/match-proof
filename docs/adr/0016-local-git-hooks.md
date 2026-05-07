# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project intentionally avoids GitHub Actions, so checks must be easy to run locally.

## Decision

Use plain `.githooks/` wired by `make install-hooks`.

Hooks:

- `pre-commit`: lint, format check, type/build, gitleaks if installed
- `commit-msg`: Conventional Commits validator
- `pre-push`: test, build, smoke

## Consequences

- Contributors opt in by running `make install-hooks`.
- Missing optional tools such as gitleaks produce an advisory rather than blocking first-time setup.

## Alternatives Considered

- Lefthook: rejected because plain shell hooks are enough for a single frontend project.
