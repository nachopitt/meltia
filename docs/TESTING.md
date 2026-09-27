# Meltia: Tiered Testing & Verification Architecture

## 1. Testing Philosophy & Pyramid

Meltia enforces a strict **Tiered Testing Pyramid** designed for fast feedback, zero regressions, and token-efficient verification.

```
       / \
      / E2E \         Tier 3: Playwright Multi-Viewport Visuals & E2E
     /-------\
    / Module  \       Tier 2: Medusa HTTP & Workflow Integration
   /-----------\
  /    Unit     \     Tier 1: Module Services, BOM Math, Dieline Vector Logic
 /---------------\
/   Docs / Lints  \   Tier 0: Fast-path static analysis & schema checks
-------------------
```

---

## 2. Testing Tiers & Commands

All tests must execute inside the designated Docker containers using the `-T` flag.

### Tier 0: Lint & Typecheck
- **Backend Lint**:
  ```bash
  docker compose exec -T workspace bash -c "cd /app/apps/backend && npm run lint"
  ```
- **Storefront Typecheck & Production Build**:
  ```bash
  docker compose exec -T workspace bash -c "cd /app/apps/storefront && npm run build"
  ```

### Tier 1: Backend Unit Isolation (Jest)
Runs in-memory with mocked repositories or pure functions:
```bash
docker compose exec -T workspace npm run test:unit
```
To run specific unit test suites:
```bash
# BlindBox Module Service entity CRUD tests
docker compose exec -T workspace bash -c "cd /app/apps/backend && TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules jest src/modules/blindbox/__tests__/service.unit.spec.ts"

# Packaging Dieline & Companion Trading Card Compositor tests (Milestone 2)
docker compose exec -T workspace bash -c "cd /app/apps/backend && TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules jest src/modules/blindbox/__tests__/dieline-compositor.unit.spec.ts"
```

### Tier 2: Module & HTTP Integration
Runs against the live containerized PostgreSQL and Redis instances:
```bash
docker compose exec -T workspace bash -c "cd /app/apps/backend && npm run test:integration:modules"
docker compose exec -T workspace bash -c "cd /app/apps/backend && npm run test:integration:http"
```

### Tier 3: Headless Playwright Multi-Viewport Visual Verification
Mandatory for any user-facing UI change (pages, components, wizard, navigation, checkout).
The verification script runs Chromium inside the `playwright` container across 4 core viewports:
- **Desktop**: 1440 x 900
- **Laptop**: 1024 x 768
- **Tablet**: 768 x 1024
- **Mobile**: 390 x 844

```bash
docker compose exec -T playwright bash -c "NODE_PATH=/home/ubuntu/.npm/_npx/e41f203b7505f1fb/node_modules node scripts/capture-visuals.cjs"
```

Screenshots are saved to `screenshots/` and inspected using `view_file` to verify responsive layout fidelity, contrast, typography, and absence of console errors.

---

## 3. Atomic Turn Invariant

No implementation turn or milestone is marked complete unless:
1. Code changes are implemented.
2. Unit tests pass cleanly.
3. Database migrations (if any) are applied.
4. Playwright visual capture passes with 0 console errors.
5. Milestone tracker (`.github/issues/tracker_meltia_blindbox.md`) receipts are recorded.
