# Meltia: Database & Schema Documentation

## 1. Database Architecture

Meltia uses **PostgreSQL 16** managed via Medusa v2's DML (Data Modeling Language) and MikroORM.
All custom data structures reside within the `blindbox` module, maintaining strict isolation from core commerce models.

```mermaid
erDiagram
    BOX_THEME ||--o{ CUSTOM_ORDER_SPEC : "styled with"
    BODY_CATALOG ||--o{ CUSTOM_FIGURE : "base body for"
    CUSTOM_ORDER_SPEC ||--|{ CUSTOM_FIGURE : "contains 1..n"
    CUSTOM_ORDER_SPEC }|--|| LINE_ITEM : "attaches to"

    BOX_THEME {
        text id PK
        text name "Template display name"
        text slug UK "Unique url/identifier"
        text description
        text dieline_svg_url "Background vector template"
        text card_template_url "Card vector template"
        json dimensions_mm "Width, height, depth in mm"
        json face_configs "Coordinates & layout per panel"
        boolean is_active
    }

    BODY_CATALOG {
        text id PK
        enum category "man | woman | boy | girl"
        text code UK "e.g. MAN_SUIT_01"
        text name "Display name"
        text description
        text preview_render_url "Chibi render URL"
        text default_name "Default character roster name"
        json filament_slots "Available customization zones"
        boolean is_active
    }

    CUSTOM_ORDER_SPEC {
        text id PK
        text line_item_id FK "Medusa core line item"
        text box_theme_id FK "Associated theme"
        text collection_title "Banner title (e.g. FAM. AGUSTÍN)"
        text dedication_headline "e.g. Felices 28 mi amor"
        text dedication_body "Heartfelt note text"
        text dedication_signature "Signature line"
        text ai_illustration_url "Synthesized couple image"
        text print_dieline_pdf_url "Generated 300 DPI PDF"
        text print_cards_pdf_url "Generated cards PDF"
        enum back_panel_mode "roster_grid | dual_showcase"
        json raw_config "Complete snapshot"
    }

    CUSTOM_FIGURE {
        text id PK
        text order_spec_id FK "Parent custom spec"
        boolean is_primary "Whether this is the box lead"
        text body_catalog_id FK "Selected archetype"
        text character_name "e.g. Lic. Elias"
        text photo_url "Uploaded portrait URL"
        text cropped_face_url "Circular face crop URL"
        text skin_filament "Selected filament code"
        text hair_filament "Selected filament code"
        text clothes_primary_filament "Selected filament code"
        text clothes_secondary_filament "Selected filament code"
        json custom_attributes "Extra accessories/notes"
    }
```

---

## 2. Table Definitions & Constraints

### 2.1. `box_theme`
- **Primary Key**: `id` (`text`)
- **Unique Indexes**: `box_theme_slug_unique` on `slug`
- **JSON Metadata**:
  - `dimensions_mm`: `{ width: 80, height: 120, depth: 60 }`
  - `face_configs`: Coordinates and bounding boxes for front banner, side dedication frame, AI scene placement, and back roster slots.

### 2.2. `body_catalog`
- **Primary Key**: `id` (`text`)
- **Unique Indexes**: `body_catalog_code_unique` on `code`
- **Categories**: Indexed enum `category` (`man`, `woman`, `boy`, `girl`) for high-performance storefront tab filtering.

### 2.3. `custom_order_spec`
- **Primary Key**: `id` (`text`)
- **Foreign Keys**:
  - `box_theme_id` -> `box_theme(id)` on delete set null.
  - `line_item_id` -> `line_item(id)` on delete cascade.

### 2.4. `custom_figure`
- **Primary Key**: `id` (`text`)
- **Foreign Keys**:
  - `order_spec_id` -> `custom_order_spec(id)` on delete cascade.
  - `body_catalog_id` -> `body_catalog(id)` on delete set null.

---

## 3. Migration Lifecycle & Invariants

> [!CRITICAL]
> **Zero Host Execution Invariant**: Never run `npx medusa` or PostgreSQL tools directly on the host machine. All migrations and queries must run in the Docker container.

### Generating a Migration
When modifying model files in `apps/backend/src/modules/blindbox/models/`:
```bash
docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:generate blindbox"
```

### Applying Migrations
```bash
docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:migrate"
```

### Direct PostgreSQL Schema Inspection
```bash
docker compose exec -T db psql -U postgres -d meltia -c "\dt"
```

---

## 4. Seeding Initial Catalog

Catalog data is seeded via [`apps/backend/src/migration-scripts/seed-blindbox-catalog.ts`](file:///home/nachopitt/projects/meltia/apps/backend/src/migration-scripts/seed-blindbox-catalog.ts):
- **8 Box Themes**: `celestial-night-gold`, `pastel-dream-clouds`, `vintage-rose-garden`, `cyber-neon-arcade`, `terracotta-sunset`, `enchanted-forest-emerald`, `monochrome-noir-minimal`, `festive-confetti-party`.
- **16 Base Bodies**: 4 Men (`MAN_SUIT_01`, `MAN_CASUAL_01`, `MAN_SPORTS_01`, `MAN_MARTIAL_01`), 4 Women (`WOMAN_GOWN_01`, `WOMAN_CASUAL_01`, `WOMAN_OFFICE_01`, `WOMAN_ATHLETIC_01`), 4 Boys, 4 Girls.

To run seed:
```bash
docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa exec ./src/migration-scripts/seed-blindbox-catalog.ts"
```
