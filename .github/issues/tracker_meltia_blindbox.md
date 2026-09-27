# Issue Tracker: Meltia Collectible Blind Box E-Commerce Platform

> **Status**: In Progress
> **Tracker File**: `.github/issues/tracker_meltia_blindbox.md`
> **Active Milestone**: Milestone 3 of 5
> **Last Updated**: 2026-09-26T18:38:00-06:00

---

## 1. Feature Roadmap & Milestones

- [x] **Milestone 1: Backend Domain Models & Catalog Seed** — *Completed*
  - Custom Medusa v2 `blindbox` module (`BoxTheme`, `BodyCatalog`, `CustomOrderSpec`, `CustomFigure`).
  - Migrations generated and applied in Postgres (`Migration20260926144451`).
  - Seed 8 box themes and 16 base bodies (4 men, 4 women, 4 boys, 4 girls).
- [x] **Milestone 2: Dieline PDF & Asset Generator Engine** — *Completed*
  - High-res 300 DPI flat packaging dieline compositor (`DielineCompositor` with 6-panel net geometry, 15° bevel tabs, dust flaps, locking bottom tongue).
  - Collectible companion trading cards compositor (`TradingCardCompositor` with 2-up 63x88mm sheet, front decorative frame, back dedication parchment).
  - Medusa v2 workflow orchestration (`generateDielineWorkflow`).
- [ ] **Milestone 3: AI Scene Synthesis & Dedication Engine** — ⏳ *Current Focus (Session 3)*
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

### Milestone 2: Dieline PDF & Asset Generator Engine
- **Files Modified/Added**:
  - `apps/backend/src/modules/blindbox/services/dieline-compositor.ts`: 6-panel tuck box geometry (80x120x60mm), 15° bevel tabs, dust flaps, locking bottom tongue, `roster_grid` and `dual_showcase` layouts, 300 DPI print-ready SVG generator.
  - `apps/backend/src/modules/blindbox/services/trading-card-compositor.ts`: 2-up trading card sheet generator (63x88mm), front decorative frame, back dedication parchment / certificate.
  - `apps/backend/src/workflows/generate-dieline-workflow.ts`: Medusa v2 workflow with steps `resolveDielineSpecStep`, `generateDielineAssetsStep`, `saveDielineAssetsStep`.
  - `apps/backend/src/modules/blindbox/service.ts`: Exposed async compositor helpers on `BlindBoxModuleService`.
  - `apps/backend/src/modules/blindbox/__tests__/dieline-compositor.unit.spec.ts`: Unit test suite (8 tests).
  - `docs/ARCHITECTURE.md`, `docs/REQUIREMENTS.md`, `docs/TESTING.md`: Documentation synchronization.
- **Verification Receipts**:
  - `npm run test:unit`: 3 test suites passed, 15 tests passed total.
  - `medusa lint`: 0 lint issues found.
  - `check-doc-sync.sh`: Documentation synchronization audit passed.
- **Decisions Made**:
  - Pure vector SVG generation using millimeter units (1 SVG unit = 1mm). Eliminates binary dependencies (no Cairo, Sharp, or headless browser memory overhead on 1GB VPS).
  - Implemented exact 15° bevel trigonometry on flaps ($dx = 35 \cdot \tan 15^\circ \approx 9.38\text{mm}$, $dy = 15 \cdot \tan 15^\circ \approx 4.02\text{mm}$) for clean die-cutting.
  - Ensured all service methods are async and step IDs conform strictly to `@medusajs/eslint-plugin` rules.

---

## 4. Active Task: Milestone 3 (AI Scene Synthesis & Dedication Engine)

- **Objective**: Implement the server-side AI illustration generation engine (Gemini/Imagen prompt engineering for couple/family hugging illustration on lateral panel & trading cards) and contextual dedication copywriting:
  - Gemini prompt synthesizer converting `CustomOrderSpec` + figure parameters into stylized chibi hugging illustrations.
  - Contextual dedication copywriting assistant (emotional tone, relationship type, occasion).
- **Step Budget**: ~30-50 steps (Max 80)
- **Files to Modify/Create**:
  - `apps/backend/src/modules/blindbox/services/ai-scene-generator.ts`
  - `apps/backend/src/workflows/generate-ai-scene-workflow.ts`
  - `apps/backend/src/modules/blindbox/__tests__/ai-scene-generator.unit.spec.ts`
- **Acceptance Criteria**:
  1. AI scene synthesizer produces structured prompts and handles image generation/mock fallbacks.
  2. Dedication copy generator supports tones and generates matching headline, body, and signature.
  3. Passes unit tests and lint checks in `workspace` container.
- **Verification Commands**:
  - `docker compose exec -T workspace npm run test:unit`
  - `docker compose exec -T workspace bash -c "cd /app/apps/backend && npm run lint"`

---

## 5. Discovered Quirks, Blockers & Lessons Learned
- **DML Relations**: In Medusa v2, child entities in `model.hasMany` need inverse `model.belongsTo` on the child model pointing back to parent with `{ mappedBy: "figures" }`.
- **Medusa Service Methods**: Public methods on Medusa service classes must be `async` (or return a `Promise`) to comply with `@medusajs/service-methods-must-be-async`.
- **Workflow Step IDs**: Step IDs passed to `createStep` must match kebab-case of the variable name without trailing `-step` suffix (e.g. `createStep("resolve-dieline-spec", ...)` for `resolveDielineSpecStep`).

---

## 6. Technical Debt & Deferred Refactors
- *None.*
