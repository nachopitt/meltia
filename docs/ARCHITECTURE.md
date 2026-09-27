# Meltia: System Architecture & Design Specification

## 1. System Overview

Meltia is an e-commerce platform designed for custom-manufactured chibi 3D collectible figures packaged in personalized 6-panel folding blind boxes with companion double-sided trading cards.

The system is architected as a headless, containerized direct-to-consumer (DTC) application optimized for low resource consumption, sub-100ms developer iteration, and cost-effective deployment on a single $6/mo (1GB RAM, 1 vCPU) VPS.

```mermaid
graph TD
    User([Customer / Browser]) -->|HTTP / WebSocket :8080| Nginx[Nginx Reverse Proxy & Static Server]
    
    subgraph Containerized Services
        Nginx -->|/ (SPA HTML/Assets)| Vite[Vite 6 / Static Files :5173]
        Nginx -->|/store, /admin, /app, /auth| Medusa[Medusa v2 Backend :9000]
        
        Medusa -->|PostgreSQL :5432| DB[(PostgreSQL 16)]
        Medusa -->|PubSub / Cache :6379| Redis[(Redis 7)]
        
        Medusa --> DielineComp[Dieline Compositor Engine]
        Medusa --> AIScene[Gemini AI Scene Generator]
    end

    subgraph Development & Testing
        Playwright[Playwright Container] -->|Automated E2E| Nginx
        Workspace[CLI Workspace Container] -->|npm / medusa / jest| Medusa
    end
```

---

## 2. Core Service Topology

| Container Service | Role | Runtime / Image | Port (Internal) | Host Port | Routing Rule |
|---|---|---|---|---|---|
| `web` | Application Gateway & Reverse Proxy | `nginx:alpine` | `80` | `8080` | Entrypoint for all external traffic |
| `vite` | Storefront SPA (Vue 3 + Vite 6) | `node:20-alpine` | `5173` | `5173` | Routes `/`, `/customizer`, `/cart`, `/@vite`, `/src` |
| `app` | Medusa v2 E-Commerce Backend | `node:20-alpine` | `9000` | `9000` | Routes `/admin`, `/store`, `/auth`, `/app` (Admin dashboard) |
| `db` | Relational Database | `postgres:16-alpine` | `5432` | `5432` | Internal database `meltia` |
| `redis` | Event Queue & Cache | `redis:7-alpine` | `6379` | `6379` | Medusa event bus and cache manager |
| `workspace` | Headless CLI & Test Execution | `node:20-alpine` | - | - | Runs migrations, seed scripts, Jest unit tests |
| `playwright` | Multi-Viewport E2E Testing | `mcr.microsoft.com/playwright` | - | - | Automated headless visual & regression checks |

---

## 3. Storefront Architecture: Why Vue 3 + Vite 6

The storefront originally contemplated Next.js 15 App Router. That architecture was discarded and redesigned from the ground up for the following technical reasons:

1. **Memory Budget & VPS Constraints**: Next.js 15 SSR Node processes consume 400–600MB of RAM at idle. Alongside Medusa (300MB) and PostgreSQL (150MB), running SSR triggered immediate out-of-memory (OOM) crashes on a 1GB RAM VPS. Compiling to a pure client-side SPA (Vue 3 + Vite 6) allows production builds to be served directly as static files by Nginx, using **0MB Node memory overhead**.
2. **Docker Bind-Mount Performance**: Turbopack and Webpack JIT file watching in Docker volume mounts caused 8–12 second cold-starts per page load and severe CPU thrashing. Vite 6 boots in **566ms** with sub-100ms Hot Module Replacement (HMR).
3. **Decoupled Headless Consumption**: The storefront communicates directly with Medusa via `@medusajs/js-sdk`. Authentication, cart state, regions, and collections resolve over standard REST endpoints without requiring SSR proxy layers.

### Frontend Tech Stack & Routing
- **Framework**: Vue 3.5 (Composition API, `<script setup>`)
- **Build Tool**: Vite 6
- **State Management**: Pinia (`useCustomizerStore`)
- **Routing**: Vue Router 4 (HTML5 history mode)
  - Strict English route paths and link names: `/` (`home`), `/customizer` (`customizer`), `/how-it-works` (`how-it-works`).
  - Cross-page hash scrolling: delayed async `scrollBehavior` resolving target `#how-it-works` from anywhere in the app.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with container queries (`@container`) and CSS-first `@theme` design tokens
- **Icons**: Lucide Icons (`lucide-vue-next`)
- **Commerce Client**: `@medusajs/js-sdk` (configured with `publishableKey`)
- **Internationalization (i18n)**:
  - Zero-bloat composable architecture (`useI18n`) with dual-sync (URL `?lang=es` + `localStorage` persistence).
  - Single-key `$t('Literal Key')` format with symmetrical dictionaries (`apps/storefront/src/lang/en.json`, `es.json`).
  - Rich slot token interpolation component (`<I18nT>`).
  - Automated AST/regex extraction and CI symmetry verification script (`scripts/extract-t-keys.mjs`).

---

## 4. Backend Architecture: Medusa v2

The backend is built on `@medusajs/medusa` v2 utilizing custom domain modules and workflows:

### 4.1. Module Isolation (`apps/backend/src/modules/blindbox`)
Business logic specific to Meltia's collectible blind box offering is encapsulated inside the `blindbox` module:
- Independent MikroORM/DML models: [`BoxTheme`](file:///home/nachopitt/projects/meltia/apps/backend/src/modules/blindbox/models/box-theme.ts), [`BodyCatalog`](file:///home/nachopitt/projects/meltia/apps/backend/src/modules/blindbox/models/body-catalog.ts), [`CustomOrderSpec`](file:///home/nachopitt/projects/meltia/apps/backend/src/modules/blindbox/models/custom-order-spec.ts), [`CustomFigure`](file:///home/nachopitt/projects/meltia/apps/backend/src/modules/blindbox/models/custom-figure.ts).
- Isolated migrations directory (`apps/backend/src/modules/blindbox/migrations/`).
- Module service inheriting `MedusaService` with typed CRUD operations and custom query helpers.

### 4.2. API Routing
- **File-based routing**: Storefront endpoints live under `src/api/store/customizer/*`; back-office management endpoints live under `src/api/admin/blindbox/*`.
- **Workflows over inline queries**: Route handlers delegate business logic to Medusa workflows (`src/workflows/`), ensuring transactional integrity and compensation rollback if steps fail.

### 4.3. Packaging & Asset Compositor Engines
- **Dieline Compositor (`DielineCompositor`)**:
  - Implements 6-panel tuck box net geometry (Width 80mm, Height 120mm, Depth 60mm, Glue Tab 15mm, Dust Flaps 35mm, Tuck Flap 20mm).
  - Exact die-cutting cut lines (`stroke="red"`), fold crease lines (`stroke="blue"` dashed with `stroke-dasharray="3,2"`).
  - 15° bevel math on glue tab and dust flaps ($dx = H_{flap} \cdot \tan 15^\circ \approx 9.38\text{mm}$, $dy = G \cdot \tan 15^\circ \approx 4.02\text{mm}$).
  - Locking bottom tongue with friction ears and locking slit.
  - Supports both `roster_grid` (6-figure roster on back panel) and `dual_showcase` (lateral AI couple illustration, dedication letter, partner portrait on back).
  - Generates resolution-independent, print-ready SVG with millimeter coordinates (315x300mm viewBox, 300 DPI ready).
- **Trading Card Compositor (`TradingCardCompositor`)**:
  - Renders 2-up companion trading card sheet (standard 63mm x 88mm cards, 3mm corner radius) on 154x108mm sheet.
  - Card 1: Front decorative frame + character illustration + collection title ribbon + Meltia branding.
  - Card 2: Back antique dedication parchment + dedication letter (dual showcase) or Certificate of Authenticity (roster grid).
- **Asset Compilation Workflow (`generateDielineWorkflow`)**:
  - Medusa v2 workflow orchestrating asset compilation from `CustomOrderSpec`.
  - Atomic steps: `resolveDielineSpecStep`, `generateDielineAssetsStep`, `saveDielineAssetsStep` with rollback compensation.

---

## 5. Gateway & Networking (Nginx)

The Nginx reverse proxy on host port `8080` mediates all traffic to prevent CORS issues and present a unified origin:

```nginx
# Medusa backend API & Admin Dashboard routes
location ~ ^/(admin|store|auth|custom|health|app)(/|$) {
    set $backend "http://app:9000";
    proxy_pass $backend;
    ...
}

# Frontend Storefront (Vite dev server / Static assets)
location / {
    set $storefront "http://vite:5173";
    proxy_pass $storefront;
    ...
}
```

The strict path boundary `(/|$)` ensures routes like `/customizer` route directly to the storefront SPA rather than matching backend prefixes.

---

## 6. Storefront Internationalization (i18n) Architecture

Meltia adopts a zero-dependency, single-key JSON internationalization architecture inspired by the Apex standard:

1. **Source of Truth (`apps/storefront/src/lang/*.json`)**:
   - Flat single-key JSON dictionaries (`en.json` base, `es.json` target).
   - Base dictionary purity: In `en.json`, key equals value (`enDict[k] === k`).
   - Parameter interpolation: `:param` tokens for dynamic value substitution.

2. **Frontend Composable Layer (`src/composables/`)**:
   - **`useI18n.ts`**: Reactive `$t(key, params)` helper with browser language detection, `localStorage` persistence (`meltia_locale`), and Vue Router query synchronization (`?lang=es`).
   - **`useCurrency.ts`**: Localized currency formatting (`formatCurrency`) standardizing amounts with `Intl.NumberFormat`, supporting locale resolution (`es-MX` vs `en-US`) and default currency (`MXN`).
   - **`useDateTime.ts`**: Localized date, time, and relative formatting (`formatDate`, `formatDateTime`, `formatRelative`) powered by browser-native `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`.

3. **Rich Translation Component (`<I18nT>`)**:
   - `apps/storefront/src/components/I18nT.vue`: Splits strings on `{token}` boundaries and renders corresponding `<template #token>` slots, preventing phrase fragmentation across differing language grammar.

4. **Static Literal Invariant & Tooling**:
   - Dynamic `$t(variable)` expressions are forbidden. All keys are declared statically (e.g. `computed(() => $t('Literal'))`).
   - `scripts/extract-t-keys.mjs`: CLI scanner supporting `--check`, `--fix`, `--prune`, `--json` to ensure 0 missing keys and alphabetic ordering.

5. **CI & Verification Guardrails**:
   - `apps/backend/src/__tests__/i18n.unit.spec.ts`: Jest unit test verifying that `scripts/extract-t-keys.mjs --check` passes, dictionaries exist, are non-empty, sorted alphabetically, 100% key-for-key symmetrical, and base purity holds.
