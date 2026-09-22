---
name: tiered-testing-pyramid
description: "Applies token-efficient tiered verification (Tier 0 docs fast-path, Tier 1 frontend unit isolation, Tier 2 backend isolation, Tier 3 full sweep), matches test runners to layer requirements, and enforces deterministic, collision-free dynamic test data. Activates when writing tests, running tests, planning test coverage, or verifying code changes."
license: MIT
metadata:
  author: meltia
---

# Tiered Testing Pyramid & Verification Standard for Meltia

This skill defines the token-optimized testing strategy and test-runner allocation model for Meltia (Node, MedusaJS 2.x, Next.js storefront, PostgreSQL, Playwright).

---

## 1. Tool Matching Matrix

Allocate tests to the specific layer best suited to verify the behavior:

| Test Tool / Layer | Execution Target | Scope & Primary Use Cases | Limitations |
| :--- | :--- | :--- | :--- |
| **Backend Unit (`test:unit`)** | `workspace` | Service unit logic, helper functions, utility calculations in Medusa modules. | Does not spin up database or test database constraints. |
| **Module Integration (`test:integration:modules`)** | `workspace` | Custom Medusa module database persistence, repository logic, module workflows. | Requires active test database (`meltia_test`). |
| **HTTP Integration (`test:integration:http`)** | `workspace` | End-to-end Medusa HTTP API route tests (`/store/*`, `/admin/*`), middleware, authentication. | Requires active test database. |
| **Browser E2E (Playwright)** | `playwright` | Storefront rendering, checkout flow, region switching, browser console errors, responsive viewports. | Heavyweight; run targeted specs during development. |

---

## 2. Tiered Domain-Aware Verification Matrix

Always execute the minimum tier required for the files modified:

### Tier 0: Pure Documentation / Markdown / Typo Tasks
- **Scope**: Changes touching only `.md` files, comments, or documentation.
- **Commands**: Check environment sync `./scripts/check-env-sync.sh`.
- **Bypass Rule**: **STRICTLY BANNED** to run full test suites for pure markdown/documentation edits.

### Tier 1: Frontend Storefront Tasks
- **Scope**: Changes in `apps/storefront/` (components, pages, styles).
- **Commands**:
  1. Linter: `docker compose exec -T workspace npm run lint`
  2. Targeted browser verification: `docker compose exec -T playwright playwright-cli goto http://web/`

### Tier 2: Medusa Backend Tasks
- **Scope**: Changes in `apps/backend/` (modules, workflows, routes, models).
- **Commands**:
  1. Unit tests: `docker compose exec -T workspace npm run test:unit`
  2. Linter: `docker compose exec -T workspace npm run lint`
  3. Module integration (if models changed): `docker compose exec -T workspace npm run test:integration:modules`

### Tier 3: Full-Stack Domain Features / PR Finalization
- **Scope**: New cross-cutting features or pre-merge verification.
- **Commands**:
  1. `docker compose exec -T workspace npm run lint`
  2. `docker compose exec -T workspace npm run test:unit`
  3. `./scripts/check-agent-readiness.sh`
