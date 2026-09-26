#!/usr/bin/env bash
# scripts/dev-info.sh
# Prints quick reference info for development URLs, services, and ports.

set -eo pipefail

echo "======================================================="
echo "                MELTIA DEVELOPMENT STACK               "
echo "======================================================="
echo ""
echo "Primary Application (Host):"
echo "  • Storefront (Customer):   http://localhost:8080/"
echo "  • Admin Dashboard:         http://localhost:8080/app"
echo ""
echo "CLI Commands Quick Reference:"
echo "  • Run tests:               docker compose exec -T workspace npm run test"
echo "  • Run unit tests:          docker compose exec -T workspace npm run test:unit"
echo "  • Run linter:              docker compose exec -T workspace npm run lint"
echo "  • Seed initial data:       docker compose exec -T workspace npm run backend:seed"
echo "  • Migrate database:        docker compose exec -T workspace bash -c \"cd /app/apps/backend && npx medusa db:migrate\""
echo "  • Run readiness audit:     ./scripts/check-agent-readiness.sh"
echo ""
echo "Debug & Diagnostics:"
echo "  • Medusa Store API:        http://localhost:8080/store (raw REST API)"
echo "  • Backend Direct Bypass:   http://localhost:9000/app (skips Nginx)"
echo "  • Storefront Direct Bypass: http://localhost:5173/ (skips Nginx)"
echo "  • PostgreSQL (Host Port):  localhost:5432 (postgres/postgres, db: meltia)"
echo "  • Redis (Host Port):       localhost:6379"
echo "  • Internal Docker Network:"
echo "      - Backend:             http://app:9000"
echo "      - Storefront:          http://vite:5173"
echo "      - Gateway:             http://web:80"
echo "      - Database:            db:5432"
echo "      - Redis:               redis:6379"
echo ""
echo "Container Service Matrix:"
docker compose ps
echo ""
echo "======================================================="
