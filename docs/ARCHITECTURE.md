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

### Frontend Tech Stack
- **Framework**: Vue 3.5 (Composition API, `<script setup>`)
- **Build Tool**: Vite 6
- **State Management**: Pinia (`useCustomizerStore`)
- **Routing**: Vue Router 4 (HTML5 history mode)
- **Styling**: Tailwind CSS with container queries (`@container`)
- **Icons**: Lucide Icons (`lucide-vue-next`)
- **Commerce Client**: `@medusajs/js-sdk` (configured with `publishableKey`)

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
