#!/usr/bin/env bash
# scripts/check-doc-sync.sh
# Audits git status to ensure code changes have corresponding docs/ updates in the same turn.

set -eo pipefail

CHANGED_FILES=$(git status --porcelain -uall | awk '{print $2}')

if [ -z "$CHANGED_FILES" ]; then
    echo "  [OK] Working tree clean. Documentation in sync."
    exit 0
fi

HAS_STOREFRONT=$(echo "$CHANGED_FILES" | grep -E "^apps/storefront" || true)
HAS_BACKEND_MODELS=$(echo "$CHANGED_FILES" | grep -E "apps/backend/src/modules/.*/models|migrations" || true)
HAS_BACKEND_API=$(echo "$CHANGED_FILES" | grep -E "apps/backend/src/(api|workflows)" || true)
HAS_TESTS=$(echo "$CHANGED_FILES" | grep -E "tests/|spec\.ts|scripts/capture-visuals" || true)
HAS_INFRA=$(echo "$CHANGED_FILES" | grep -E "docker/|docker-compose" || true)

ERRORS=0

if [ -n "$HAS_STOREFRONT" ]; then
    if ! echo "$CHANGED_FILES" | grep -qE "docs/ARCHITECTURE.md|docs/REQUIREMENTS.md"; then
        echo "  [WARNING] Storefront modified, but neither docs/ARCHITECTURE.md nor docs/REQUIREMENTS.md were updated."
        ERRORS=$((ERRORS + 1))
    fi
fi

if [ -n "$HAS_BACKEND_MODELS" ]; then
    if ! echo "$CHANGED_FILES" | grep -q "docs/DATABASE.md"; then
        echo "  [WARNING] Backend models/migrations modified, but docs/DATABASE.md was not updated."
        ERRORS=$((ERRORS + 1))
    fi
fi

if [ -n "$HAS_BACKEND_API" ]; then
    if ! echo "$CHANGED_FILES" | grep -qE "docs/ARCHITECTURE.md|docs/REQUIREMENTS.md"; then
        echo "  [WARNING] Backend API/workflows modified, but docs/ARCHITECTURE.md or docs/REQUIREMENTS.md were not updated."
        ERRORS=$((ERRORS + 1))
    fi
fi

if [ -n "$HAS_TESTS" ]; then
    if ! echo "$CHANGED_FILES" | grep -q "docs/TESTING.md"; then
        echo "  [WARNING] Tests or test scripts modified, but docs/TESTING.md was not updated."
        ERRORS=$((ERRORS + 1))
    fi
fi

if [ -n "$HAS_INFRA" ]; then
    if ! echo "$CHANGED_FILES" | grep -qE "docs/DEPLOYMENT.md|docs/DEBUGGING.md|docs/ARCHITECTURE.md"; then
        echo "  [WARNING] Infrastructure modified, but deployment/debugging docs were not updated."
        ERRORS=$((ERRORS + 1))
    fi
fi

if [ $ERRORS -eq 0 ]; then
    echo "  [OK] Documentation synchronization audit passed."
else
    echo "  [AUDIT] Found $ERRORS potential documentation desync warning(s)."
fi
