#!/usr/bin/env bash
# scripts/dev-info.sh
# Prints quick reference info for development URLs, services, and ports.

set -eo pipefail

echo "======================================================="
echo "                MELTIA DEVELOPMENT STACK               "
echo "======================================================="
echo ""
echo "Public Access Endpoints (Host):"
echo "  • Storefront (Nginx):      http://localhost:8080/"
echo "  • Medusa Admin Dashboard:  http://localhost:8080/app"
echo "  • Medusa Store API:        http://localhost:8080/store"
echo "  • Backend Direct:          http://localhost:9000/app"
echo "  • Storefront Direct:       http://localhost:5173/"
echo ""
echo "Internal Network Endpoints (Docker Compose):"
echo "  • Gateway (Nginx):         http://web:80"
echo "  • Medusa Backend:          http://app:9000"
echo "  • Storefront (Vite/Next):  http://vite:5173"
echo "  • PostgreSQL:              db:5432 (database: meltia)"
echo "  • Redis:                   redis:6379"
echo ""
echo "Container Service Matrix:"
docker compose ps
echo ""
echo "CLI Commands Quick Reference:"
echo "  • Run tests:               docker compose exec -T workspace npm run test"
echo "  • Run unit tests:          docker compose exec -T workspace npm run test:unit"
echo "  • Run linter:              docker compose exec -T workspace npm run lint"
echo "  • Seed initial data:       docker compose exec -T workspace npm run backend:seed"
echo "  • Migrate database:        docker compose exec -T workspace bash -c \"cd /app/apps/backend && npx medusa db:migrate\""
echo "  • Run readiness audit:     ./scripts/check-agent-readiness.sh"
echo "======================================================="
