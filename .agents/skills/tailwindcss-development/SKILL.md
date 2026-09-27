---
name: tailwindcss-development
description: "Always invoke when the user's message includes 'tailwind' in any form. Also invoke for: building responsive grid layouts (multi-column card grids, product grids), flex/grid page structures (dashboards with sidebars, fixed topbars, mobile-toggle navs), styling UI components (cards, tables, navbars, pricing sections, forms, inputs, badges), adding dark mode variants, fixing spacing or typography, and Tailwind CSS v4 work. The core use case: writing or fixing Tailwind utility classes in Vue templates."
license: MIT
metadata:
  author: meltia
---

# Tailwind CSS v4 Development

## Documentation & Best Practices

Tailwind CSS v4 is used across the storefront with `@tailwindcss/vite` and CSS-first configuration in `apps/storefront/src/style.css`.

## Basic Usage

- Use Tailwind CSS classes to style Vue Single File Components (`.vue`). Check and follow existing Tailwind conventions before introducing new patterns.
- Group elements logically, remove redundant classes, and consider class placement, order, and priority.

## Tailwind CSS v4 Specifics

- Use Tailwind CSS v4 syntax and avoid deprecated utilities.
- Configuration is CSS-first using the `@theme` directive in `src/style.css` — no `tailwind.config.js` or `postcss.config.js` exists.

### CSS-First Theme Configuration

In `apps/storefront/src/style.css`:

```css
@import "tailwindcss";

@theme {
  --font-serif: "Cinzel", serif;
  --font-sans: "Plus Jakarta Sans", sans-serif;

  --color-meltia-gold: #D4AF37;
  --color-meltia-navy: #0a1128;
  --color-meltia-dark: #050814;
  --color-meltia-card: #121a36;
  --color-meltia-border: #1f2b52;
}
```

This generates `font-serif`, `font-sans`, `bg-meltia-gold`, `text-meltia-gold`, `border-meltia-border`, `bg-meltia-card`, etc.

### Replaced Utilities in v4

| Deprecated | Replacement |
|------------|-------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |

## Spacing

Use `gap` utilities instead of margins for spacing between siblings:

```html
<div class="flex gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
</div>
```

## Common Pitfalls

- Using deprecated v3 utilities (bg-opacity-*, flex-shrink-*, etc.)
- Using `@tailwind` directives instead of `@import "tailwindcss"`
- Trying to create or reintroduce `tailwind.config.js` or `postcss.config.js` instead of `@theme`
- Using margins for spacing between siblings instead of gap utilities
