# 0003 - Frontend Framework and Build Tooling

## Status

Accepted

## Context

The UI needs rich local state, accessible controls, a small bundle, typed modules, and GitHub Pages output.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, TanStack Query, Zod, Comlink, idb, and lucide-react.

## Consequences

- Vite builds directly into `docs/`.
- React keeps interaction work straightforward.
- Tailwind keeps the CSS compact and consistent.
- TanStack Query handles public GitHub metadata fetching for the visible current commit.

## Alternatives Considered

- Vanilla TypeScript: smaller, but slower to build a polished app.
- Next.js: rejected because static GitHub Pages is the target and a server framework would add unnecessary ceremony.
