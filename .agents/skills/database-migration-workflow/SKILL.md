---
name: database-migration-workflow
description: "Governs database schema migrations, Medusa v2 data models, PostgreSQL transactions, and data seeding. Activates when creating or modifying Medusa models, migrations, seeders, or database queries."
license: MIT
metadata:
  author: meltia
---

# Database Migration & Schema Workflow for Meltia (Medusa v2)

This skill governs schema design, data model definitions, migrations, and transactional persistence across PostgreSQL in Meltia.

---

## 1. Schema Pre-Inspection Invariant

> [!CRITICAL]
> **Inspect Before Editing**: Always inspect existing tables and migrations before writing new models or database modifications.
> To inspect schema:
> ```bash
> docker compose exec -T db psql -U postgres -d meltia -c "\d <table_name>"
> ```

---

## 2. Core Medusa v2 Migration Workflow

### 1. Generating Migrations for Custom Modules
When adding or updating a data model in `apps/backend/src/modules/<module-name>/models/`:
```bash
docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:generate <module-name>"
```

### 2. Executing Migrations
To run pending migrations:
```bash
docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:migrate"
```

### 3. Seeding Database
To seed initial store, products, regions, categories, and sales channels:
```bash
docker compose exec -T workspace npm run backend:seed
```

---

## 3. Transaction & Data Integrity Invariants

### 1. Atomic Workflows
In Medusa v2, mutations that span multiple tables or services MUST be composed within atomic Medusa workflows (`createWorkflow` / `createStep`) with explicit compensation steps:
```typescript
import { createStep, createWorkflow, StepResponse } from "@medusajs/framework/workflows-sdk"

const myStep = createStep("my-step", async (input, { container }) => {
  // execute mutation
  return new StepResponse(result, rollbackData)
}, async (rollbackData, { container }) => {
  // compensation logic on failure
})
```

### 2. Non-Destructive Schema Evolution
- Never drop columns or rename existing columns in production tables without a multi-phase migration strategy.
- Add nullable columns or provide sensible defaults.
- Ensure proper foreign key indexing and cascading rules.
