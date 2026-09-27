---
name: containerized-environment-orchestrator
description: "Manages safe containerized command execution, dynamic Docker Compose service discovery, internal/host network URL translation, and TTY handling. Activates when running terminal commands (Node, npm, npx medusa, turbo, jest, vitest, psql, playwright), inspecting container logs, resolving application URLs, or interacting with docker-compose environments."
license: MIT
metadata:
  author: meltia
---

# Containerized Environment Orchestrator

This skill governs command execution, service routing, and network translation for projects running inside Docker Compose. It ensures strict isolation between the host machine and containerized runtime environments.

---

## 1. The Container Execution Invariant

> [!CRITICAL]
> **Zero Host Execution**: Never execute runtime commands (Node, npm, npx medusa, turbo, jest, vitest, psql, playwright) directly on the host machine. All execution MUST target the designated Docker container via `docker compose exec -T`.

### Execution Rule
```bash
docker compose exec -T <target_service> <command>
```

### The Non-Interactive TTY Invariant (`-T`)
The `-T` flag disables pseudo-TTY allocation. It is **MANDATORY** for all agent command invocations and background scripts to prevent `the input device is not a TTY` aborts.

---

## 2. Dynamic Service Discovery & Target Matrix

Inspect `docker-compose.yml` to map CLI operations to container services. Standard roles:

| Service Role | Container Service | Target Command Example |
| :--- | :--- | :--- |
| **CLI Runtime / Node / Medusa** | `workspace` | `docker compose exec -T workspace npm run test:unit`<br>`docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:migrate"` |
| **Medusa Backend** | `app` | Runs `@dtc/backend` on port `9000` (Admin dashboard at `/app`) |
| **Storefront** | `vite` | Runs `@dtc/storefront` on port `5173` |
| **Web Server / Gateway** | `web` | Handles HTTP traffic on port `8080` (reverse proxy to `app` & `vite`) |
| **Database** | `db` | `docker compose exec -T db psql -U postgres -d meltia` |
| **Cache / Redis** | `redis` | `docker compose exec -T redis redis-cli ping` |
| **Headless Browser / E2E** | `playwright` | `docker compose exec -T playwright playwright-cli <command>` |

If a repository uses different service names (e.g. `app` instead of `workspace`), discover them dynamically by reading `docker-compose.yml`.

### Interactive Browser Automation (`playwright-cli`)

The official `playwright-cli` skill provides interactive browser commands (`open`, `goto`, `click`, `screenshot`, `snapshot`, etc.). In this containerized project, all `playwright-cli` usage MUST go through the `playwright` Docker container:

```bash
docker compose exec -T playwright playwright-cli <command>
```

**Examples:**
```bash
docker compose exec -T playwright playwright-cli open http://web
docker compose exec -T playwright playwright-cli screenshot --filename=page.png
docker compose exec -T playwright playwright-cli snapshot
docker compose exec -T playwright playwright-cli click e5
```

> [!IMPORTANT]
> Never run `playwright-cli` or `npx playwright cli` directly on the host. The `playwright-cli` binary is available inside the `playwright` container.

---

## 3. Network URL Translation & Resolution

Projects in Docker have two distinct networking scopes:

### 1. Internal Container-to-Container Network (Playwright & Backend)
- Containers communicate using Docker network DNS aliases (service names).
- Web server URL within the network: `http://web:80` (or `http://web`).
- When running Playwright in the `playwright` container, always inject the internal URL:
  ```bash
  docker compose exec -T -e APP_URL=http://web playwright node scripts/capture-visuals.cjs
  ```

### 2. Host-Accessible URL (User Manual Verification)
- When presenting verification instructions or links to the human user, use the host port mapped in `docker-compose.yml` (or `.env`):
  - Check compose port mapping for `web` (e.g. `ports: - "${WEB_PORT:-8080}:80"`).
  - Public Host URL: `http://localhost:8080/<path>`.
  - Never share internal container URLs (`http://web/...`) with the human user.

---

## 4. Diagnostics & Health Self-Check

Before running tasks or when diagnosing connection failures:
1. Verify container states:
   ```bash
   docker compose ps
   ```
2. Verify workspace runtime responsiveness:
   ```bash
   docker compose exec -T workspace node -v
   ```
3. If containers are halted, run readiness script or restart:
   ```bash
   docker compose up -d
   ```
