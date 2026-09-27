#!/usr/bin/env bash
# scripts/check-agent-readiness.sh
# Verifies the project's health and ensures the agent is ready to proceed.

set -eo pipefail

echo "========================================="
echo "    AI Agent Project Readiness Auditor    "
echo "========================================="
echo ""

# 1. Check for required documents
echo "Checking critical documentation files..."
REQUIRED_DOCS=(
    "README.md"
    "docker-compose.yml"
    "docker-compose.dev.yml"
    "docker-compose.prod.yml"
    ".agents/AGENTS.md"
    ".github/copilot-instructions.md"
    "docs/ARCHITECTURE.md"
    "docs/REQUIREMENTS.md"
    "docs/DATABASE.md"
    "docs/TESTING.md"
    "docs/DEPLOYMENT.md"
    "docs/DEBUGGING.md"
)

ALL_DOCS_FOUND=true
for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  [OK] $doc is present"
    else
        echo "  [ERROR] Missing $doc"
        ALL_DOCS_FOUND=false
    fi
done

if [ "$ALL_DOCS_FOUND" = false ]; then
    echo "CRITICAL: Some documentation files are missing. Please restore them."
    exit 1
fi

# 1.5 List available documentation
echo ""
echo "Discovered Project Documentation Files:"
find . -maxdepth 3 -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" | sort | while read -r doc_file; do
    clean_path="${doc_file#./}"
    echo "  - $clean_path"
done

# 2. Check if .agents/AGENTS.md and .github/copilot-instructions.md are in sync
echo ""
echo "Checking agent instructions synchronization..."
if cmp -s ".agents/AGENTS.md" ".github/copilot-instructions.md"; then
    echo "  [OK] Agent rules and Copilot instructions are synchronized."
else
    echo "  [WARNING] .agents/AGENTS.md and .github/copilot-instructions.md differ."
    echo "            Please sync changes between these two files."
fi

# 2.5 Check environment variable synchronization
echo ""
if ! ./scripts/check-env-sync.sh; then
    echo "  [ERROR] Environment variables are out of sync. Please see errors above."
    exit 1
fi

# 2.6 Check documentation synchronization
echo ""
echo "Checking documentation synchronization against git diff..."
if [ -f "./scripts/check-doc-sync.sh" ]; then
    ./scripts/check-doc-sync.sh
fi

# 3. Check container status
echo ""
echo "Checking Docker containers..."
REQUIRED_CONTAINERS=(
    "meltia-app-dev"
    "meltia-web-dev"
    "meltia-db-dev"
    "meltia-redis-dev"
    "meltia-workspace-dev"
    "meltia-vite-dev"
)

ALL_CONTAINERS_RUNNING=true
for container in "${REQUIRED_CONTAINERS[@]}"; do
    STATUS=$(docker inspect --format '{{.State.Status}}' "$container" 2>/dev/null || echo "not found")
    if [ "$STATUS" = "running" ]; then
        echo "  [OK] $container is running"
    else
        echo "  [ERROR] $container is not running (status: $STATUS)"
        ALL_CONTAINERS_RUNNING=false
    fi
done

if [ "$ALL_CONTAINERS_RUNNING" = false ]; then
    echo "CRITICAL: One or more required dev containers are not running. Run 'docker compose up -d' to start them."
    exit 1
fi

# 4. Check application health status
echo ""
echo "Checking workspace container health..."
if docker compose exec -T workspace node -v > /dev/null 2>&1; then
    NODE_V=$(docker compose exec -T workspace node -v | tr -d '\r')
    echo "  [OK] Workspace Node environment active (${NODE_V})."
else
    echo "  [ERROR] Workspace Node environment unresponsive."
    exit 1
fi

echo "Checking Medusa backend health..."
if docker compose exec -T workspace curl -sf http://app:9000/health > /dev/null 2>&1; then
    echo "  [OK] Medusa backend responsive at http://app:9000."
else
    echo "  [WARNING] Medusa backend health check failed."
fi

echo ""
echo "========================================="
echo "  Agent status: READY TO PROCEED         "
echo "========================================="
exit 0
