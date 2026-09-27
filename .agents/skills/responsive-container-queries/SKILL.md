---
name: responsive-container-queries
description: "Governs container query layouts (@container, @xl:, @2xl:) and responsive component architecture. Activates when building or modifying responsive UI components, data tables, submenu tabs, card headers, or modal panels in Tailwind CSS."
license: MIT
metadata:
  author: meltia
---

# Responsive Layout & Container Queries Standard

This skill defines responsive layout architecture using Tailwind CSS container queries (`@container`). It ensures components adapt fluidly to their immediate container width rather than the global viewport size.

---

## 1. The Container Query Invariant

> [!CRITICAL]
> **No Viewport Breakpoints on Sub-Components**: NEVER use global viewport breakpoints (`sm:`, `md:`, `lg:`, `xl:`) for customizer panels, 3D box previews, character cards, or wizard steps. Use container queries (`@container`, `@xl:`, `@2xl:`) on the parent container.

---

## 2. Core Architectural Rules

### 1. The Container Query Enforcement
Wrap parent cards, customizer panels, and preview viewports in `@container`:

- **Wizard Tabs & Step Controls**:
  - Class: `@xl:flex-row @xl:space-x-2`
  - Below `@xl:` (672px): Fall back to fluid horizontal scrolling:
    `overflow-x-auto scrollbar-none flex-nowrap shrink-0`

- **Card Headers & Action Rows**:
  - Class: `@2xl:flex-row @2xl:items-center @2xl:justify-between`
  - Below `@2xl:`: Fall back to vertical stacking:
    `flex-col gap-3 items-stretch`

### 2. Customizer & Character Cards
- Character cards in roster grids must use `@container`:
  - Narrow containers (< `@md`): Single-column figure stack (`grid-cols-1`).
  - Wide containers ($\ge$ `@md`): Multi-column grid (`@md:grid-cols-2 @xl:grid-cols-3`).
- **Pricing & Total Columns**: Financial and price calculations must declare explicit min-widths (`w-32 min-w-[100px] text-right`) with `tabular-nums` to prevent number wrapping or truncation.

### 3. Modals, Dialogs & Photo Cropper
- **Max-Height Scrolling**: All modal/dialog bodies must declare `max-h-[80vh] overflow-y-auto` to prevent action footers from being pushed offscreen on mobile viewports.
- **Action Button Stacking**: Dialog footers must stack buttons (`flex-col-reverse @sm:flex-row @sm:justify-end gap-2`) on narrow viewports.

### 4. Clean Card-Stack vs. Desktop Table Separation
- Use clean declarative separation:
  - Mobile/Tablet: `<div class="space-y-4 @xl:hidden">` rendering standalone cards.
  - Desktop: `<div class="hidden @xl:block overflow-x-auto">` rendering wide tabular views.
  - **Key Symmetry Invariant**: Action button tooltips, aria labels, and `$t()` keys across viewports MUST remain identical. Never invent synonyms between viewports.

### 5. Universal Playwright Visual Inspection Loop
When modifying ANY frontend UI (pages, components, forms, dialogs/modals, navigation, or preview cards):
1. Run the headless Playwright screenshot test across the 4 core viewports:
   - Desktop (1440px)
   - Laptop (1024px)
   - Tablet (768px)
   - Mobile (390px)
   ```bash
   docker compose exec -T playwright bash -c "NODE_PATH=/home/ubuntu/.npm/_npx/e41f203b7505f1fb/node_modules node scripts/capture-visuals.cjs"
   ```
2. Inspect the PNG screenshots directly using `view_file` to verify:
   - Zero element overlaps or collisions
   - Zero unintended text or number truncations
   - Symmetrical card proportions and clean alignments across viewports
