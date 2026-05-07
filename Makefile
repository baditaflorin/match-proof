.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview release clean hooks-pre-commit hooks-commit-msg hooks-pre-push

help:
	@printf "Targets:\n"
	@printf "  make install-hooks     Wire local git hooks\n"
	@printf "  make dev               Run the frontend dev server\n"
	@printf "  make build             Build GitHub Pages assets into docs/\n"
	@printf "  make test              Run unit tests\n"
	@printf "  make smoke             Build, serve, and run Playwright smoke test\n"
	@printf "  make lint              Run linters and type checks\n"
	@printf "  make fmt               Format source files\n"
	@printf "  make pages-preview     Preview the Pages build locally\n"
	@printf "  make release           Tag the current version\n"
	@printf "  make clean             Remove generated caches\n"

install-hooks:
	git config core.hooksPath .githooks

dev:
	npm run dev

build:
	npm run build
	test -f docs/index.html
	cp docs/index.html docs/404.html

test:
	npm run test

test-integration:
	npm run test

smoke:
	npm run smoke

lint:
	npm run lint
	npm run fmt:check
	npm run build

fmt:
	npm run fmt

pages-preview:
	npm run pages-preview

release:
	git tag v$$(node -p "require('./package.json').version")

clean:
	rm -rf node_modules/.vite coverage playwright-report test-results

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push
