# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Environment

This project is developed inside a Docker container called `devcontainer`.
The commands below assume you are running inside the `devcontainer`.

From the host, run them inside it with
`docker compose exec -T devcontainer <command>` (start it first with
`docker compose up -d`). The other service containers (`node`, `playwright`)
are implementation details — do not call them directly.

If file `/.dockerenv` is present, you are in a Docker container.

For details on the development environment, see
[docs/dev-environment.md](docs/dev-environment.md).

## Commands

Run these inside the `devcontainer` (from the host, prefix with
`docker compose exec -T devcontainer`).

| Task                        | Command                     |
|-----------------------------|-----------------------------|
| Install JS                  | `npm ci`                    |
| Build library               | `npm run build`             |
| Start dev server            | `npm start`                 |
| Run all checks (lint+tests) | `npm test`                  |
| Run ESLint only             | `npm run test:eslint`       |
| Run Jest only               | `npm run test:jest`         |

Notes:

* Commands like `npm`, `node`, `npx` run in the `node` container via wrapper
  scripts. If you need to communicate directly with a specific Docker container,
  use `sudo docker compose ...`.
* A `playwright` service is available for browser automation and testing. Any
  npm script whose name starts with `test:playwright` is routed to the
  `playwright` container automatically by the `npm` wrapper. The project must
  define such scripts (and a Playwright config) to use it.
* See the `scripts` section in `package.json` for the full list of commands.

## Topics (Claude Rules)

Project rules live in [.claude/rules/](.claude/rules/):

* [code.md](.claude/rules/code.md) — scope discipline, minimal changes.
* [git.md](.claude/rules/git.md) — branches, commits, PRs.
* [safety-guards.md](.claude/rules/safety-guards.md) — hard guard rails.

## Agents (Claude Agents)

Specialized agents live in [.claude/agents/](.claude/agents/).

* `code-reviewer` — review a change against this repo's rules (uncommitted work,
  or a whole branch vs its base).

## AI Integration

MCP-capable assistants in the `devcontainer` can drive host Chrome to verify the
rendered component previews in a real browser. See
[docs/ai-integration.md](docs/ai-integration.md) and
[scripts/mcps/chrome-host/README.md](scripts/mcps/chrome-host/README.md).
