# Deploy

Live site:

https://baditaflorin.github.io/match-proof/

The project deploys from `main /docs` through GitHub Pages.

## Publish

```sh
make build
git add docs src package.json package-lock.json vite.config.ts
git commit -m "chore: publish pages build"
git push
```

## Roll Back

Revert the publishing commit and push:

```sh
git revert <commit>
git push
```

## Custom Domain

No custom domain is configured in v1. If one is added, create `docs/CNAME`, configure DNS with the GitHub Pages records, and update ADR 0010.

GitHub Pages custom domain docs:

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
