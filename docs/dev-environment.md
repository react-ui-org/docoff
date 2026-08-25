# Development Environment

This project ships a Dockerized development environment with AI coding
assistants (Claude Code, GitHub Copilot CLI, OpenCode) pre-installed.

## What the stack contains

Three Docker Compose services:

* **`devcontainer`** — the main development environment you attach to. Debian
  based, with Git, shells (bash/zsh/fish), editors, the Docker CLI (for
  Docker-from-Docker), and the AI assistant CLIs. Commands like `npm`, `node`
  and `npx` are thin wrappers that execute inside the `node` container.
* **`node`** — Node.js environment that runs the build and the webpack dev
  server (`npm start`), exposed on `COMPOSE_START_PORT` (default `8080`).
* **`playwright`** — Playwright environment for browser automation and testing.
  Any npm script whose name starts with `test:playwright` is routed here
  automatically by the `npm` wrapper. Its report server is exposed on
  `COMPOSE_PLAYWRIGHT_REPORT_PORT` (default `9323`). The project must add its own
  Playwright config and `test:playwright*` scripts to use it.

## Security note

The `devcontainer` mounts the host Docker socket (`/var/run/docker.sock`) so
that the `npm`, `node` and `npx` wrappers and the AI assistants can run
commands in the other service containers (Docker-from-Docker). Access to the
Docker socket is equivalent to **root on the host**: anything running inside
the `devcontainer` — including the AI assistants — can start privileged
containers and mount host paths. Passwordless `sudo` inside the container is
limited to `docker` and `chown` for the same reason. Only use this environment
with code and tools you trust.

## Requirements

* Docker (Docker Desktop or native Docker Engine) with the Compose plugin.
* An editor that supports dev containers (VS Code, JetBrains) is optional —
  you can also use the stack directly from the command line.
* `ncat` (package `nmap-ncat` or `nmap`) — only on native Docker Engine, and
  only for the Chrome-host bridge, which uses it to expose Chrome's loopback
  DevTools port to the container. Not needed on Docker Desktop. See
  [ai-integration.md](ai-integration.md).

## Setup

Run the setup script from the project root on the **host**:

```bash
bash ./setup.sh
```

It:

1. Creates `.env` from `.env.dist` and fills in the project name and your
   host UID/GID (and shell/editor if set).
2. Creates `docker-compose.yml` from `docker-compose.yml.dist`.
3. Configures the Chrome-host bridge networking on native Docker Engine
   (no-op on Docker Desktop).
4. Builds the Docker images.

Dev-container-aware IDEs run `setup.sh` automatically via the
`initializeCommand` in [`.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json).

## Running

Start the stack and attach:

```bash
docker compose up -d
docker compose exec devcontainer <your shell>   # e.g. bash / fish / zsh
```

From inside the `devcontainer`:

```bash
npm ci          # install dependencies
npm run build   # build the library
npm start       # start the webpack dev server on COMPOSE_START_PORT (8080)
npm test        # ESLint + Jest
```

To have the `node` container install, build and serve automatically on start,
set `COMPOSE_AUTOSTART=true` in `.env`.

## Configuration

All configuration lives in `.env` (created from `.env.dist`). Key variables:

* `COMPOSE_PROJECT_NAME` — Compose project name (derived from the directory).
* `COMPOSE_START_PORT` — host port for the webpack dev server (default `8080`).
* `COMPOSE_PLAYWRIGHT_REPORT_PORT` — host port for the Playwright report server
  (default `9323`).
* `COMPOSE_UID` / `COMPOSE_GID` — host user/group IDs for correct file
  ownership in mounted volumes.
* `COMPOSE_AUTOSTART` — auto install/build/serve in the `node` container.
* `PW_WORKERS` / `PW_CT_PORT` — Playwright worker count and Component Testing
  port.
* `EDITOR` / `VISUAL` / `SHELL` — preferred editor and shell in the container.
* `BLOCK_SSH_AUTH_SOCK` — opt out of SSH agent forwarding into the container.
* `CHROME_DEBUG_PORT` / `CHROME_BIN` — Chrome-host bridge overrides
  (see [ai-integration.md](ai-integration.md)).

## AI integration

See [ai-integration.md](ai-integration.md) for the AI assistants and the
Chrome-host MCP bridge that lets them drive Chrome on your host to verify the
rendered component previews.
