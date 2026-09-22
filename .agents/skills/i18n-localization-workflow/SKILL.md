---
name: i18n-localization-workflow
description: "Governs dual- and multi-dictionary translation workflows (lang/*.json, locales/*.json), $t() and __() string extraction, parameter interpolation, and key synchronization audits. Activates when adding, editing, or refactoring user-facing UI text in Vue templates, Inertia pages, Blade files, backend controllers, validation messages, or modifying language dictionaries."
license: MIT
metadata:
  author: core
---

# i18n Localization Workflow Standard

This skill establishes best practices for single-key internationalization, automated key extraction, and dictionary symmetry across frontend and backend layers.

---

## 1. Project Documentation Discovery

Before modifying UI text or dictionaries, inspect whether the repository maintains a dedicated i18n architecture specification:
- Check for `docs/architecture/i18n_architecture.md`, `docs/i18n.md`, or matching localization docs via `find_by_name` or `view_file`.
- If present, adhere to its project-specific conventions.
- If absent, apply the standard universal invariants below.

---

## 2. Universal Invariants

### 1. Zero Raw Text
- **Frontend (Vue/Inertia)**: All user-facing UI strings must be wrapped in `$t('Literal Key')` or rich `<I18nT>` components.
- **Backend (PHP/Laravel)**: All user-facing strings must use `__('Literal Key')`.
- **Static Literal Rule**: Never pass dynamic variables (`$t(variable)`) or concatenated strings into translation helpers. Keys must remain static string literals for static extraction tools.

### 2. Base & Target Dictionary Symmetry
- The base language dictionary (typically `en.json`) and all target dictionaries (e.g. `es.json`) must remain **key-for-key symmetrical**.
- Never add or edit keys in a secondary dictionary without updating the base dictionary in lockstep.

### 3. Automated Key Extraction & Audit
- If the project provides an extraction script (e.g., `scripts/extract-t-keys.js` or `npm run i18n:extract`):
  - Run the extractor with `--fix` whenever adding or editing UI strings to automatically register and sort keys.
  - Run audit mode (`node scripts/extract-t-keys.js --check`) to verify `missing_keys === 0` across all dictionaries before concluding work.
  - When `--fix` registers new keys, immediately translate target dictionaries (e.g. `lang/es.json`). Never leave fallback English strings in non-English dictionaries.

### 4. Parameter Interpolation
- Use standardized token formats:
  - Backend: `__('Hello :name', ['name' => $user->name])`
  - Frontend: `$t('Hello :name', { name: user.name })`

### 5. Canonical Key Reuse Across Responsive Viewports
- When duplicating interactive markup across responsive breakpoints (such as mobile card stacks vs. desktop tables), always reuse canonical keys from the primary view.
- Avoid introducing synonyms (e.g. `$t('Edit Material')` vs `$t('Edit Item')`) across display modes.

### 6. Punctuation & Casing Standards (Anti-Duplication)
- **No Trailing Colons**: Never include trailing colons in translation keys (use `$t('Date')` + `:`, never `$t('Date:')`).
- **No Trailing Ellipses**: Use `$t('Search')` or `$t('Search patients')`, avoid creating separate keys ending with `...`.
- **Casing Standards**: Use Title Case for buttons, table column headers, and navigation titles. Use Sentence case for descriptions.
- **Orphan Pruning on Refactors**: When renaming or retiring a feature's UI text, remove the obsolete keys from both `lang/en.json` and `lang/es.json`.

### 7. Base Dictionary Purity & Immediate Translation
- **English Key/Value Identity**: In `en.json`, the value must always equal the key (`enDict[key] === key`). Never commit target-language strings into base dictionaries.
- **Immediate Target Translation**: Whenever `extract-t-keys.js --fix` generates new entries, immediately provide genuine translations in `es.json`. Never leave raw English placeholders in target dictionaries.
