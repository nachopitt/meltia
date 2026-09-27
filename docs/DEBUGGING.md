# Meltia: Debugging, Diagnostics & Troubleshooting Guide

## 1. Quick Diagnostics Cheat Sheet

Always execute diagnostic commands via `docker compose exec -T <container>`:

```bash
# Check container status
docker compose ps

# Inspect logs with tail
docker compose logs --tail=50 app     # Medusa backend
docker compose logs --tail=50 vite    # Storefront Vite dev server
docker compose logs --tail=50 web     # Nginx reverse proxy
docker compose logs --tail=50 db      # PostgreSQL

# Run agent readiness verification
./scripts/check-agent-readiness.sh
```

---

## 2. Common Issues & Solutions

### 2.1. Vite 6 Returns `403 Forbidden` (`Blocked request. This host is not allowed`)
- **Root Cause**: Vite 6 blocks requests where the `Host` header does not match localhost by default (triggered when requested through Docker network `http://vite:5173` or Nginx gateway).
- **Fix**: Ensure `apps/storefront/vite.config.ts` includes `allowedHosts: true`:
  ```ts
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    watch: { usePolling: true }
  }
  ```

### 2.2. Storefront Route Returns `404 Not Found` from Medusa Backend
- **Root Cause**: The Nginx backend proxy regex in `docker/nginx/default.conf` matched prefixes greedily (e.g. `^/(admin|store|auth|custom|health|app)` matched `/customizer` and forwarded it to Medusa on port 9000).
- **Fix**: Enforce the exact path separator boundary `(/|$)`:
  ```nginx
  location ~ ^/(admin|store|auth|custom|health|app)(/|$) {
      set $backend "http://app:9000";
      proxy_pass $backend;
  }
  ```
  Then reload Nginx:
  ```bash
  docker compose exec -T web nginx -s reload
  ```

### 2.3. Playwright Cannot Find Chromium inside Container
- **Root Cause**: Playwright container image `mcr.microsoft.com/playwright:v1.62.0-noble` houses pre-installed browser binaries at `/ms-playwright/chromium-1234/chrome-linux64/chrome`. Running a higher `@playwright/test` version in node can fail looking for a newer binary.
- **Fix**: In [`scripts/capture-visuals.cjs`](file:///home/nachopitt/projects/meltia/scripts/capture-visuals.cjs), explicitly detect and supply the container's executable path:
  ```js
  const executablePath = fs.existsSync("/ms-playwright/chromium-1234/chrome-linux64/chrome")
    ? "/ms-playwright/chromium-1234/chrome-linux64/chrome"
    : undefined
  ```
  And invoke Node with the NPX cached modules path:
  ```bash
  docker compose exec -T playwright bash -c "NODE_PATH=/home/ubuntu/.npm/_npx/e41f203b7505f1fb/node_modules node scripts/capture-visuals.cjs"
  ```

### 2.4. Medusa DML Migration Not Applying
- **Root Cause**: Custom entity models were edited without running `npx medusa db:generate <module>` followed by `npx medusa db:migrate`.
- **Fix**: Run generation and migration inside `workspace`:
  ```bash
  docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:generate blindbox && npx medusa db:migrate"
  ```
- **Verify Schema**:
  ```bash
  docker compose exec -T db psql -U postgres -d meltia -c "\d box_theme"
  ```

### 2.5. Storefront Cannot Communicate with Medusa (`401` or CORS Error)
- **Root Cause**: Missing or mismatched `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` or `publishableKey` in `@medusajs/js-sdk` client options.
- **Fix**: Verify client initialization in [`apps/storefront/src/lib/medusa.ts`](file:///home/nachopitt/projects/meltia/apps/storefront/src/lib/medusa.ts):
  ```ts
  export const sdk = new Medusa({
    baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:8080",
    publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "pk_...",
  })
  ```
