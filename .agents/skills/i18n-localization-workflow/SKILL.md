---
name: i18n-localization-workflow
description: "Governs dual-dictionary translation workflows (apps/storefront/src/lang/*.json), $t() string extraction, parameter interpolation, and key synchronization audits. Activates when adding, editing, or refactoring user-facing UI text in Vue templates, components, views, or modifying language dictionaries."
license: MIT
metadata:
  author: meltia
---

# i18n Localization Workflow Standard

This skill establishes best practices for single-key internationalization, automated key extraction, and dictionary symmetry across the Meltia platform.

---

## 1. Project Documentation Discovery

Before modifying UI text or dictionaries, inspect existing architecture in:
- `docs/ARCHITECTURE.md` (Section 6: Storefront Internationalization)
- `apps/backend/src/__tests__/i18n.unit.spec.ts` (CI Guardrail test)

---

## 2. Universal Invariants

### 1. Zero Raw Text
- **Frontend (Vue 3)**: All user-facing UI strings must be wrapped in `$t('Literal Key')` or rich `<I18nT>` components.
- **Static Literal Rule**: Never pass dynamic variables (`$t(variable)`) or concatenated strings into translation helpers. Keys must remain static string literals for static extraction tools.

### 2. Base & Target Dictionary Symmetry
- The base language dictionary (`apps/storefront/src/lang/en.json`) and target dictionary (`apps/storefront/src/lang/es.json`) must remain **key-for-key symmetrical**.
- Never add or edit keys in a secondary dictionary without updating the base dictionary in lockstep.

### 3. Automated Key Extraction & Audit
- Use the project's extraction script:
  - Run the extractor with `--fix` whenever adding or editing UI strings:
    ```bash
    npm run i18n:fix
    # or: node scripts/extract-t-keys.mjs --fix
    ```
  - Run audit mode to verify `missing_keys === 0` across all dictionaries:
    ```bash
    npm run i18n:check
    # or: node scripts/extract-t-keys.mjs --check
    ```
  - When `--fix` registers new keys, immediately translate target dictionary (`apps/storefront/src/lang/es.json`). Never leave fallback English strings in non-English dictionaries.

### 4. Parameter Interpolation
- Use standardized token formats:
  `$t('Hello :name', { name: user.name })`

### 5. Canonical Key Reuse Across Responsive Viewports
- When duplicating interactive markup across responsive breakpoints (such as mobile card stacks vs. desktop tables), always reuse canonical keys from the primary view.
- Avoid introducing synonyms (e.g. `$t('Edit Material')` vs `$t('Edit Item')`) across display modes.

### 6. Punctuation & Casing Standards (Anti-Duplication)
- **No Trailing Colons**: Never include trailing colons in translation keys (use `$t('Date')` + `:`, never `$t('Date:')`).
- **No Trailing Ellipses**: Use `$t('Search')`, avoid creating separate keys ending with `...`.
- **Casing Standards**: Use Title Case for buttons, table column headers, and navigation titles. Use Sentence case for descriptions.
- **Orphan Pruning on Refactors**: When renaming or retiring a feature's UI text, remove the obsolete keys using `npm run i18n:prune`.

### 7. Base Dictionary Purity & Immediate Translation
- **English Key/Value Identity**: In `en.json`, the value must always equal the key (`enDict[key] === key`). Never commit target-language strings into base dictionaries.
- **Immediate Target Translation**: Whenever `npm run i18n:fix` generates new entries, immediately provide genuine translations in `es.json`.
