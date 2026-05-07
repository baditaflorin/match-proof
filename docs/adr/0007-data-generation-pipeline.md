# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

Mode B projects need an offline data pipeline. Match Proof is Mode A.

## Decision

Do not include a data-generation pipeline in v1.

## Consequences

- `make data` is intentionally absent.
- All sample data is local demo fixture data in source code.
- No generated Parquet, SQLite, or JSON data artifacts are committed.

## Alternatives Considered

- Generate demo credential fixtures offline: rejected because local browser generation better demonstrates the no-server model.
