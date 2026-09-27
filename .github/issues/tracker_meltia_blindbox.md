# Issue Tracker: Meltia Collectible Blind Box E-Commerce Platform

> **Status**: In Progress  
> **Tracker File**: `.github/issues/tracker_meltia_blindbox.md`  
> **Active Milestone**: Milestone 2 of 5  
> **Last Updated**: 2026-09-26T09:55:00-06:00

---

## 1. Feature Roadmap & Milestones

- [x] **Milestone 1: Backend Domain Models & Catalog Seed** — *Completed*
  - Custom Medusa v2 `blindbox` module (`BoxTheme`, `BodyCatalog`, `CustomOrderSpec`, `CustomFigure`).
  - Migrations generated and applied in Postgres (`Migration20260926144451`).
  - Seed 8 box themes and 16 base bodies (4 men, 4 women, 4 boys, 4 girls).
- [ ] **Milestone 2: Dieline PDF & Asset Generator Engine** — ⏳ *Current Focus (Session 2)*
  - High-res 300 DPI flat packaging dieline compositor (matching `IMG-20260908-WA0012.jpg` layout).
  - Collectible companion trading cards compositor.
- [ ] **Milestone 3: AI Scene Synthesis & Dedication Engine** — *Pending (Session 3)*
  - Posed couple/family hugging illustration generator for box side panel and trading cards.
  - Contextual dedication copy generator.
- [ ] **Milestone 4: Storefront Customizer Wizard** — *Pending (Session 4)*
  - Interactive 8-step wizard with live 3D dieline preview, photo cropper, filament selector, and cart integration.
- [ ] **Milestone 5: Admin Production Dashboard & Verification Sweep** — *Pending (Session 5)*
  - Medusa Admin manufacturing hub: 3D printing filament BOM generator, photo ZIP pack, print dieline downloads.

---

## 2. Architectural Decisions & Key Context

- **Data Models / Schema**:
  - `BoxTheme`: Stores template metadata, dieline dimensions, background asset URLs, card template URLs.
  - `BodyCatalog`: Categorized by `man`, `woman`, `boy`, `girl`, with default codes (`MAN_SUIT_01`, `LIC_ELIAS`), preview renders, and mesh/STL paths.
  - `CustomOrderSpec`: Links to line item, tracks collection title, dedication headline & body, AI illustration URL, print dieline PDF URL, and back panel display mode (`roster_grid` vs `dual_showcase`).
  - `CustomFigure`: Character breakdown per box (name, body reference, original/cropped photo URLs, filament codes for skin, hair, clothes).
- **Service Boundaries**:
  - Custom module `src/modules/blindbox`.
  - Backend API routes: `src/api/store/customizer/*` and `src/api/admin/blindbox/*`.
- **Storefront Architecture**:
  - Migrated from Next.js 15 App Router to **Vue 3 + Vite 6 + Pinia + Vue Router + Tailwind CSS + `@medusajs/js-sdk`**.
  - Dev server boots in 566ms (vs 10s Turbopack JIT in Docker).
  - Headless Playwright visual capture verified across 1440px Desktop, 1024px Laptop, 768px Tablet, and 390px Mobile with 0 console errors.
  - Production build: `dist/index.html` (0.87 kB), `dist/assets/index.js` (265 kB gzipped: 95 kB) in 7.38s.
- **Infrastructure**:
  - Pure containerized execution via `docker compose exec -T workspace`.
  - Nginx gateway on port 8080 routing to Medusa (9000) and Storefront (5173).
  - Path boundary `^/(admin|store|auth|custom|health|app)(/|$)` ensures `/customizer` SPA routes properly to Vite.

---

## 3. Completed Milestone Receipts

### Milestone 1: Backend Domain Models & Catalog Seed
- **Files Modified/Added**:
  - `apps/backend/src/modules/blindbox/models/box-theme.ts`: Model definition
  - `apps/backend/src/modules/blindbox/models/body-catalog.ts`: Model definition
  - `apps/backend/src/modules/blindbox/models/custom-order-spec.ts`: Model definition
  - `apps/backend/src/modules/blindbox/models/custom-figure.ts`: Model definition
  - `apps/backend/src/modules/blindbox/service.ts`: MedusaService subclass with CRUD operations
  - `apps/backend/src/modules/blindbox/index.ts`: Module registration entry
  - `apps/backend/src/modules/blindbox/migrations/Migration20260926144451.ts`: Migration generated & executed
  - `apps/backend/src/modules/blindbox/__tests__/service.unit.spec.ts`: Unit test suite (4 tests)
  - `apps/backend/src/migration-scripts/seed-blindbox-catalog.ts`: Seed script (8 themes + 16 bodies)
  - `apps/backend/medusa-config.ts`: Module registered
- **Verification Receipts**:
  - `npm run test:unit`: 2 test suites passed, 5 tests passed total.
  - `medusa lint`: 0 lint issues found.
  - PostgreSQL verification: `box_theme` (8 rows), `body_catalog` (16 rows: 4 girl, 4 woman, 4 boy, 4 man).
- **Decisions Made**:
  - Structured `CustomOrderSpec` and `CustomFigure` as parent-child relationship with cascading foreign keys to support 1-to-many figures per blind box.
  - Explicit unique constraints on `slug` for themes and `code` for bodies to ensure idempotency.

---

## 4. Active Task: Milestone 2 (Dieline PDF & Asset Generator Engine)

- **Objective**: Implement the server-side packaging compositor engine that renders high-resolution 300 DPI flat folding box dielines and double-sided companion trading cards matching Diana's production files (`IMG-20260908-WA0012.jpg`).
- **Step Budget**: ~30-50 steps (Max 80)
- **Files to Modify/Create**:
  - `apps/backend/src/modules/blindbox/services/dieline-compositor.ts`: Layout and canvas/vector renderer for 6-panel tuck box
  - `apps/backend/src/modules/blindbox/services/trading-card-compositor.ts`: 2-up trading card sheet renderer
  - `apps/backend/src/workflows/generate-dieline-workflow.ts`: Medusa workflow orchestrating asset compilation
  - `apps/backend/src/modules/blindbox/__tests__/dieline-compositor.unit.spec.ts`: Unit tests validating dieline dimensions and panel placement
- **Acceptance Criteria**:
  1. Box dieline renderer produces valid 6-panel layout matching dimensions (Front, Back, Left Side, Right Side, Top Tuck, Bottom Tuck, Glue Tabs).
  2. Trading card compositor produces double-sided companion cards matching proportions.
  3. Compositor passes unit tests in `workspace` container.
- **Verification Commands**:
  - `docker compose exec -T workspace npm run test:unit`
  - `docker compose exec -T workspace bash -c "cd /app/apps/backend && npm run lint"`

---

## 5. Discovered Quirks, Blockers & Lessons Learned
- **DML Relations**: In Medusa v2, child entities in `model.hasMany` need inverse `model.belongsTo` on the child model pointing back to parent with `{ mappedBy: "figures" }`.

---

## 6. Technical Debt & Deferred Refactors
- *None.*
