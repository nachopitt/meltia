# Meltia: Production Deployment & Infrastructure Specification

## 1. Hosting Environment & Resource Budget

Meltia is designed to run efficiently on an entry-level cloud VPS ($6/month on DigitalOcean, Hetzner, or Linode) with:
- **1 vCPU**
- **1 GB RAM** (with 2 GB swapfile)
- **25 GB SSD**

### Memory Allocation Budget (Production)

| Component | Architecture Role | Target RAM Usage | Max Cap |
|---|---|---|---|
| **Nginx** | Gateway, SSL Termination, Static File Server | ~15 MB | 30 MB |
| **Storefront (SPA)** | Pre-compiled static assets (`dist/`) served by Nginx | **0 MB (Static)** | 0 MB |
| **Medusa v2 Backend** | Node.js headless commerce runtime | ~320 MB | 450 MB |
| **PostgreSQL 16** | Relational Database | ~120 MB | 200 MB |
| **Redis 7** | Cache & Event Bus | ~20 MB | 40 MB |
| **Linux OS & Buffers** | Kernel & system daemons | ~150 MB | 200 MB |
| **Total Steady State** | - | **~625 MB** | **~920 MB (Safe under 1GB)** |

> [!NOTE]
> Compiling the storefront into a static Vue 3 SPA eliminates the Node.js SSR runtime that would otherwise consume 400–600MB and cause OOM failures on this hardware tier.

---

## 2. Docker Compose Production Topology

Production containers are defined in `docker-compose.yml` and `docker-compose.prod.yml`:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Build & Deploy Sequence

```bash
# 1. Pull latest code
git pull origin main

# 2. Build storefront static bundle
docker compose exec -T workspace bash -c "cd /app/apps/storefront && npm run build"

# 3. Apply any pending database migrations
docker compose exec -T workspace bash -c "cd /app/apps/backend && npx medusa db:migrate"

# 4. Restart backend container if code changed
docker compose restart app

# 5. Reload Nginx to serve updated static assets
docker compose exec -T web nginx -s reload
```

---

## 3. Environment Variables & Secrets

Never commit real secrets to git. Production configuration resides in `.env`:

```ini
# App General
APP_ENV=production
APP_NAME=Meltia
NEXT_PUBLIC_BASE_URL=https://meltia.com

# Ports
WEB_PORT=80
BACKEND_PORT=9000
VITE_PORT=5173

# Database & Cache
DB_HOST=db
DB_PORT=5432
DB_DATABASE=meltia
DB_USERNAME=postgres
DB_PASSWORD=<SECURE_PASSWORD>
REDIS_URL=redis://redis:6379

# Medusa Secrets (minimum 32 characters)
JWT_SECRET=<STRONG_RANDOM_SECRET_32_CHARS>
COOKIE_SECRET=<STRONG_RANDOM_SECRET_32_CHARS>

# CORS
AUTH_CORS=https://meltia.com
STORE_CORS=https://meltia.com
ADMIN_CORS=https://meltia.com

# Public Storefront Keys
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://meltia.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<MEDUSA_PUBLISHABLE_KEY>
```
