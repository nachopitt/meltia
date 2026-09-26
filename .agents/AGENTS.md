# Project Manifest & Core Invariants for Meltia

> [!IMPORTANT]
> **Synchronization & Precedence Notice**: Keep `.agents/AGENTS.md` and `.github/copilot-instructions.md` byte-for-byte identical at all times.
> Project-specific rules in this file take strict precedence over generic upstream framework scaffolding in `CLAUDE.md` and root `AGENTS.md`.

---

## 🤖 AI Agent Workflow & Core Invariants 🤖

1. **Turn 1 Readiness & Atomic Turn Protocol**:
   - At the beginning of any new task, issue, or conversation, execute the project readiness script:
     `./scripts/check-agent-readiness.sh`
   - Review recent commits (`git log -n 5`) and active tracker file (`.github/issues/tracker_*.md`) before taking action.
   - **Atomic Turn Execution Invariant**: A task or implementation turn is NEVER complete until all relevant layers are updated together in the SAME turn:
     1. **Code**: Medusa backend / Next.js storefront implementation.
     2. **Tests**: Matching Jest/Vitest/Playwright tests passing.
     3. **Database**: Migrations generated and applied if data models change (`docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:generate <module> && npx medusa db:migrate"`).
     4. **Documentation**: Canonical domain markdown files and the active PR/issue tracker (`.github/issues/tracker_*.md`).
     5. **Frontend Visual Verification**: Whenever modifying or creating user-facing UI (pages, components, forms, dialogs/modals, navigation, cart, checkout), execute the headless Playwright visual capture loop across core viewports (1440px Desktop, 1024px Laptop, 768px Tablet, 390px Mobile) and inspect rendered screenshots using `view_file`.

2. **Container Execution Invariant (CRITICAL)**:
   > [!CRITICAL]
   > **Zero Host Execution**: Never execute runtime commands (Node, npm, npx medusa, turbo, jest, vitest, psql, playwright) directly on the host machine. All execution MUST target the designated Docker container via `docker compose exec -T <target_service> <command>`.
   > The `-T` flag disables pseudo-TTY allocation and is **MANDATORY** for all agent command invocations.

   ### Dynamic Service Target Matrix:
   | Service Role | Container Service | Target Command Example |
   | :--- | :--- | :--- |
   | **CLI Workspace** | `workspace` | `docker compose exec -T workspace npm run test:unit`<br>`docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:migrate"` |
   | **Medusa Backend** | `app` | Runs `@dtc/backend` on port `9000` (Admin dashboard at `/app`) |
   | **Storefront** | `vite` | Runs `@dtc/storefront` on port `5173` |
   | **Gateway / Reverse Proxy** | `web` | Nginx reverse proxy on host port `8080` (routes `/admin`, `/store`, `/app` to Medusa, `/` to storefront) |
   | **Database** | `db` | PostgreSQL 16 on port `5432` (`docker compose exec -T db psql -U postgres -d meltia`) |
   | **Cache / Queue** | `redis` | Redis 7 on port `6379` (`docker compose exec -T redis redis-cli ping`) |
   | **Browser Testing** | `playwright` | `docker compose exec -T playwright playwright-cli <command>` |

3. **Network URL Resolution**:
   - **Container-to-Container (Internal)**:
     - Nginx gateway: `http://web:80`
     - Medusa backend: `http://app:9000`
     - Storefront: `http://vite:5173`
     - PostgreSQL: `db:5432`
     - Redis: `redis:6379`
   - **Host-Accessible URLs (Human User & Verification)**:
     - Application Gateway (Nginx): `http://localhost:8080/`
     - Medusa Admin Dashboard: `http://localhost:8080/app` or `http://localhost:9000/app`
     - Medusa Store API: `http://localhost:8080/store` or `http://localhost:9000/store`
     - Storefront Direct: `http://localhost:5173/`

4. **Mandatory Domain Skill Stack (Progressive Disclosure)**:
   Activate specialized skills based on the task domain:
   - **Docker & Container Execution**: [`containerized-environment-orchestrator`](.agents/skills/containerized-environment-orchestrator/SKILL.md) — Mandatory for running CLI/tests in Docker (`workspace`/`playwright`), `-T` flag invariants, and network resolution. Never run runtime tools on the host.
   - **Database Lifecycle**: [`database-migration-workflow`](.agents/skills/database-migration-workflow/SKILL.md) — Medusa v2 migrations, PostgreSQL schema inspection, data seeding (`initial-data-seed.ts`).
   - **Tiered Verification & Test Matrix**: [`tiered-testing-pyramid`](.agents/skills/tiered-testing-pyramid/SKILL.md) — Tier 0 docs fast-path, Tier 1 unit isolation (`npm run test:unit`), Tier 2 module & HTTP integration suites, Tier 3 full sweep.
   - **Interactive Browser Testing**: [`playwright-cli`](.agents/skills/playwright-cli/SKILL.md) — Browser automation inside the `playwright` Docker container.
   - **Bug Reproduction & Diagnostics**: [`bug-reproduction-protocol`](.agents/skills/bug-reproduction-protocol/SKILL.md) — 5-step test-first reproduction loop and tool matching.
   - **E-Commerce & High-Craft UI**: [`b2b-saas-craft`](.agents/skills/b2b-saas-craft/SKILL.md) — High-density product tables, checkout flows, semantic tokens, tabular figures.
   - **Responsive Layouts & Components**: [`responsive-container-queries`](.agents/skills/responsive-container-queries/SKILL.md) & [`tailwindcss-development`](.agents/skills/tailwindcss-development/SKILL.md) — `@container` queries, multi-viewport layout validation.
   - **Milestone Orchestration**: [`milestone-task-orchestrator`](.agents/skills/milestone-task-orchestrator/SKILL.md) — 30–50 step budgets, tracker receipts, single-milestone bounded handoffs.
   - **Git Hygiene & Commit Limits**: [`git-commit-discipline`](.agents/skills/git-commit-discipline/SKILL.md) — User staging ownership, hard $\le 50$ char subject formula, $\le 72$ body wrapping, zero CLI command form suggestions.
   - **Instructions Hygiene**: [`instructions-hygiene`](.agents/skills/instructions-hygiene/SKILL.md) — Byte-for-byte synchronization between `.agents/AGENTS.md` and `.github/copilot-instructions.md`.

5. **Workspace File Creation & Native Tool Invariants**:
   - **Native Tool Invariant**: Always use `write_to_file` to create files and `replace_file_content` to edit files. Never fall back to shell `cat`, `echo`, or EOF redirect scripts (`cat << 'EOF' > ...`).
   - **Artifact vs. Workspace Disambiguation (`ArtifactMetadata`)**:
     * **Workspace Files (`/home/nachopitt/projects/meltia/...`)**: NEVER pass `ArtifactMetadata` when invoking `write_to_file` on ANY repository file (whether `.ts`, `.js`, `.json`, `.md`, `.sh`, `.yml`, `.css`). Attaching it to any workspace path causes an immediate `invalid artifact path` tool failure.
     * **Brain Artifacts Only (`~/.gemini/.../brain/<id>/`)**: `ArtifactMetadata` is strictly reserved for ephemeral session artifacts in the brain directory.
   - **Workspace Document Persistence**: Write all issue descriptions, pull request templates, design specs, and milestone trackers under `.github/issues/`.

6. **Medusa Framework Architecture Conventions**:
   - **File-based Routing**: Store routes reside in `apps/backend/src/api/store/<path>/route.ts`, admin in `apps/backend/src/api/admin/<path>/route.ts`.
   - **Business Logic in Workflows**: Route handlers must delegate business logic to Medusa workflows (`src/workflows/`) composing atomic steps, not inline queries.
   - **Model Migrations**: Every custom model change requires `npx medusa db:generate <module>` followed by `npx medusa db:migrate`.
   - **Publishable API Key**: Storefront requests to the backend require `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
