---
name: responsive-container-queries
description: "Governs container query layouts (@container, @xl:, @2xl:) and responsive component architecture. Activates when building or modifying responsive UI components, data tables, submenu tabs, card headers, or modal panels in Tailwind CSS."
license: MIT
metadata:
  author: apex
---

# Responsive Layout & Container Queries Standard

This skill defines responsive layout architecture using Tailwind CSS container queries (`@container`). It ensures components adapt fluidly to their immediate container width rather than the viewport size.

---

## 1. The Container Query Invariant

> [!CRITICAL]
> **No Viewport Breakpoints on Sub-Components**: NEVER use global viewport breakpoints (`sm:`, `md:`, `lg:`, `xl:`) for data tables, card action rows, modal interiors, or submenu navigation bars. Use container queries (`@xl:`, `@2xl:`) on the parent container.

---

## 2. Core Architectural Rules

### 1. The Uncollapsed Sidebar Math Invariant
- In desktop application layouts with persistent navigation sidebars (e.g. `w-64` / 256px), nested panels at 768px (`md:`) or 1024px (`lg:`) only receive **~320px–512px** of usable width.
- Using viewport breakpoints like `md:grid-cols-3` or `lg:flex-row` causes text wrapping explosions, overflow clipping, and visual collisions.

### 2. Container Query Enforcement
Wrap parent cards, column panels, and submenu tab bars in `@container`:

- **Submenu Tabs**:
  - Class: `@xl:flex-row @xl:space-x-2`
  - Below `@xl:` (672px): Fall back to fluid horizontal scrolling:
    `overflow-x-auto scrollbar-none flex-nowrap shrink-0`

- **Card Headers & Action Rows**:
  - Class: `@2xl:flex-row @2xl:items-center @2xl:justify-between`
  - Below `@2xl:` (672px): Fall back to vertical stacking:
    `flex-col gap-3 items-stretch`

### 3. Canonical PageSubmenu Standard
- All portal and page submenus (Admin, Settings, Dentists, Patients) MUST use the unified `PageSubmenu.vue` component passed into `<template #submenu>` of `PageShell.vue` rather than ad-hoc inline `<nav>` markup or legacy vertical `<aside>` panels.

### 4. Data Tables & Data Lists
- **Unified Action Button Standard**: Action buttons in tables must use `inline-flex items-center justify-end gap-1` with standard `size-8 rounded-xl p-0 variant="ghost"` icon buttons. Every button must include a `:title` tooltip and an accessible `<span class="sr-only">` label. Action columns must declare explicit min-widths (`min-w-[120px]` to `min-w-[140px] text-right`) to prevent wrapping or collisions.
- **Never use percentage widths for action button columns**: Action button groups have rigid min-content widths (e.g. 4 icon buttons in 1 row require `w-36 min-w-[136px]`). Using `w-[12%]` or `w-[10%]` causes overflow collisions into adjacent numeric columns.
- **Prefer `table-auto` inside `overflow-x-auto`**: In `table-auto`, the browser respects column minimums and assigns remaining width to flexible text columns (`min-w-[200px] flex-1`), preventing overlaps.
- **Dedicated Pricing Column Widths**: Financial and valuation columns must declare explicit min-widths (`w-32 min-w-[100px] text-right`) to prevent number wrapping or truncation.

### 5. Metric Dashboards & Stat Displays
- **Adaptive Container Columns**: Never cram 5 cards into a single row on container widths below `@4xl` (896px).
  - Mobile (< `@sm`): `grid-cols-1`
  - Tablet (`@sm` to `@2xl`): `grid-cols-2`, with full-width valuation card (`@sm:col-span-2`)
  - Laptop (`@2xl` to `@4xl`): `grid-cols-3`, with 2-column valuation card (`@2xl:col-span-2`)
  - Desktop (`>= @4xl`): `grid-cols-5`
- **Strict Anti-Truncation Standard**: NEVER apply `truncate` to currency values, valuations, or primary metric counts. Adjust font size (`text-lg sm:text-xl font-black`) and icon badge sizing (`size-10`) so text never overflows.

### 6. Modals, Dialogs & Forms
- **Max-Height Scrolling**: All modal/dialog bodies must declare `max-h-[80vh] overflow-y-auto` to prevent action footers from being pushed offscreen on mobile viewports.
- **Responsive Form Grids**: Never hardcode multi-column grids in modals without container queries (`grid-cols-1 @sm:grid-cols-2`).
- **Action Button Stacking**: Dialog footers must stack buttons (`flex-col-reverse @sm:flex-row @sm:justify-end gap-2`) on narrow viewports.

### 7. Clean Card-Stack vs. Desktop Table Separation
- Never emulate mobile cards by setting `<tr>` and `<td>` to `block` with stacked horizontal borders.
- Use clean declarative separation:
  - Mobile/Tablet: `<div class="space-y-4 @xl:hidden">` rendering standalone `rounded-2xl` cards.
  - Desktop & Laptop: `<div class="hidden @xl:block overflow-x-auto">` rendering the clean table (uncollapses on 1024px laptop viewports where usable content width is ~662px-696px).
  - **Key Symmetry Invariant**: Action button tooltips, aria labels, and `$t()` keys across mobile cards and desktop table MUST remain identical (e.g. use canonical `$t('Edit Item')` and `$t('Delete Item')` in both). Never invent synonyms (e.g. `$t('Edit Material')`) between viewports.

### 8. Universal Playwright Visual Inspection Loop
Unit tests only verify DOM text presence (`wrapper.text().toContain(...)`), never layout spacing, wrapping, or collisions.
When modifying ANY frontend UI (pages, components, forms, dialogs/modals, navigation, tables, or metric cards):
1. Run a headless Playwright screenshot test across the 4 core viewports:
   - Desktop (1440px)
   - Laptop (1024px)
   - Tablet (768px)
   - Mobile (390px)
2. Inspect the PNG screenshots directly using `view_file` to verify:
   - Zero element overlaps or collisions
   - Zero unintended text or number truncations
   - Symmetrical card proportions and clean alignments across viewports

### 9. Standard Viewport Verification Spectrum
When verifying responsive layouts in Playwright E2E (`e2e/responsive-smoke.spec.ts`), test across the 6 standard target viewports:
1. `Mobile-S` (320px)
2. `Mobile` (390px)
3. `Tablet` (768px)
4. `Tablet` (834px)
5. `Desktop` (1440px)
6. `Ultrawide` (1920px)
