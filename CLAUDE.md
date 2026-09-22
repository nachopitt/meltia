# Mandatory Project Invariants for Meltia

> [!IMPORTANT]
> **Precedence Notice**: The project-specific rules in [.agents/AGENTS.md](.agents/AGENTS.md) take strict precedence over upstream scaffolding in this file.

1. **Docker Container Execution**:
   All runtime commands (`npm`, `npx medusa`, `node`, `jest`, `vitest`, `playwright`, `psql`) MUST run inside Docker containers using `docker compose exec -T <service> <command>` (e.g. `docker compose exec -T workspace npm run test`). Never execute directly on the host.
2. **Turn 1 Readiness Check**:
   At the beginning of every session or task, you MUST run `./scripts/check-agent-readiness.sh` and inspect recent commits (`git log -n 5`) and active trackers (`.github/issues/tracker_*.md`).
3. **Continuous Documentation Synchronization**:
   Updating canonical domain documentation files and tracking files in `.github/issues/` is MANDATORY on every domain change.
4. **Canonical Rules**:
   Read and strictly follow [.agents/AGENTS.md](.agents/AGENTS.md) for full testing, responsive UI, database lifecycle, and architectural rules.
