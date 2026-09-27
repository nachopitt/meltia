---
name: b2b-saas-craft
description: "Enforces high-craft frontend design standards: data-dense layouts, anti-AI-slop heuristics, tabular typography, semantic color tokens, container queries, and instant interactions. Activates when building or modifying Vue templates, tables, forms, metric dashboards, or UI components."
license: MIT
metadata:
  author: meltia
---

# UI Craft & Data-Dense Layout Standard

This skill establishes design and frontend engineering standards for high-craft e-commerce, customizers, and admin dashboards (Linear, Stripe, GitHub quality).

It eliminates generic "AI slop" aesthetics—such as cartoonish padding, giant border radii, decorative gradients, and jarring staggered animations—in favor of ergonomics, speed, and scanability.

---

## 1. The Anti-AI-Slop Heuristics

| Anti-Pattern ("AI Slop") | High-Craft Standard |
| :--- | :--- |
| Giant bubbly padding (`p-8`, `p-12`) on small data | Compact vertical rhythm (`py-2`, `px-3` in tables; `p-4` on cards) |
| Excessive rounded corners (`rounded-3xl`, `rounded-full` cards) | Crisp, professional radii (`rounded-lg`, `rounded-md`, `rounded-xl` max) |
| Centered numbers or currency in tables | Right-aligned numbers with `font-mono tabular-nums` |
| Low-contrast text or decorative pastel colors | WCAG AA compliant neutral foregrounds with strict hierarchy |
| Decorative CSS gradients / patterns behind data | Clean, neutral surface layers (`bg-card`, `bg-muted/40`) with 1px borders |
| Page-load staggered reveals (`animation-delay`) | Instant rendering with zero layout shift; sub-150ms micro-transitions |
| Neon, saturated status pills | Subtle tinted badges (`bg-color/10 text-color border-color/20`) |
| Unhandled overflow causing horizontal page blowouts | Container queries (`@container`) with progressive column disclosure |

---

## 2. Layout & Information Density

Users operate tools efficiently when information density is prioritized over expansive whitespace.

### Compact Vertical Rhythm
* **Table Rows:** Use `py-2 px-3` or `py-2.5 px-4` to allow 15–20 rows to be scanned without endless scrolling.
* **Card Panels:** Use `p-4` or `p-5`. Avoid nested cards adding compounding `p-6` padding.
* **Form Spacing:** Group related fields with `space-y-4` or `gap-4`. Avoid sprawling single-input rows.

### Surface Hierarchy & Borders
* Rely on crisp 1px borders (`border border-border` or `border-neutral-800`) rather than heavy drop shadows.
* Limit shadows to `shadow-xs` or `shadow-sm` on elevated cards, dialogs, and popovers.
* Layer background neutrals to establish depth:
  * Page canvas: `bg-neutral-950`
  * Card / Panel container: `bg-neutral-900` / `bg-meltia-card`
  * Table headers / nested wells: `bg-neutral-800/40`

---

## 3. Typography & Data Alignment

### Font Selection & Metrics
* Use clean, legible system/sans-serif fonts (Plus Jakarta Sans) and serif display fonts (Cinzel) for brand headers.
* **Tabular Numbers Mandatory:** Always apply `tabular-nums` (and preferably `font-mono`) to:
  * Prices, currency, and financial balances
  * Quantities and weights (grams of filament)
  * Timestamps, dates, and durations
  * Order numbers, SKUs, and line item IDs

### Strict Data Alignment Matrix
* **Text / Names / Descriptions:** Left-aligned (`text-left`).
* **Numbers / Currencies / Totals:** Right-aligned (`text-right`). Column headers MUST match data alignment (`<th class="text-right">` for `<td class="text-right">`).
* **Status Badges:** Left-aligned or centered (`text-left` or `text-center`).
* **Row Actions:** Right-aligned (`text-right` or `justify-end`).

### Label & Value Hierarchy
Differentiate labels from data values clearly:
* **Field Labels & Table Headers:** Small, muted, distinct (`text-xs font-medium uppercase tracking-wider text-neutral-400`).
* **Values:** High contrast, clear weight (`text-sm font-medium text-neutral-100`).

---

## 4. Colors & Semantic Signaling

In order fulfillment and custom manufacturing dashboards, color conveys critical operational status. Do not use color decoratively.

### Strict Semantic Roles
* **Success / Confirmed / Shipped:** Emerald / Green (`text-emerald-400`, `bg-emerald-500/10 border-emerald-500/20`).
* **Warning / Pending / Needs Review:** Amber / Yellow (`text-amber-400`, `bg-amber-500/10 border-amber-500/20`).
* **Destructive / Cancelled / Error:** Red / Rose (`text-rose-400`, `bg-rose-500/10 border-rose-500/20`).
* **Info / In Production:** Sky / Blue (`text-sky-400`, `bg-sky-500/10 border-sky-500/20`).
* **Neutral / Draft / Archived:** Neutral / Zinc (`text-neutral-400`, `bg-neutral-800 border-neutral-700`).

---

## 5. Responsive Architecture & Progressive Disclosure

### Container-First Design
* Wrap all data tables, card stacks, and dashboards in `@container`.
* Never rely solely on viewport breakpoints (`sm:`, `md:`, `lg:`) for sub-components housed in sidebars or multi-column grids.

### Progressive Column Disclosure
For tables with $\ge 5$ columns:
1. Identify primary columns (e.g. Order #, Customer, Status, Total, Actions).
2. Mark secondary columns with `hidden @5xl:table-cell` (or fold secondary metadata as subtext inside the primary cell on narrower containers).
3. Under `@xl` (576px), switch from table layout to a structured card stack layout where each item renders as a compact card.

---

## 6. Ergonomics, Motion & Complete States

### Zero-Latency Interaction
* **No Page-Load Animations:** Never use staggered reveals (`animation-delay`) or fade-in transitions on page load.
* **Micro-Transitions Only:** Limit interactive feedback to quick state changes: `transition-colors duration-150 ease-out` on buttons, dropdowns, and hover rows.

### Mandatory UI States
Every data component must account for 4 distinct lifecycle states:
1. **Populated State:** High-density, aligned data.
2. **Empty State:** Dedicated illustration/icon + clear explanation + single primary call to action.
3. **Loading State:** Skeleton loaders matching shape and density.
4. **Truncation & Overflow:** Wrap long strings with `truncate` or `line-clamp-1` and provide an accessible `:title` or tooltip.
