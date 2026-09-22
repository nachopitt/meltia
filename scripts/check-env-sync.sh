#!/usr/bin/env bash
# scripts/check-env-sync.sh
# Verifies that all configuration keys defined in .env.example are present in .env.

set -eo pipefail

ENV_FILE=".env"
EXAMPLE_FILE=".env.example"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: .env file not found. Copy it from .env.example first."
    exit 1
fi

if [ ! -f "$EXAMPLE_FILE" ]; then
    echo "ERROR: .env.example file not found."
    exit 1
fi

echo "Checking environment variables synchronization..."

# Extract keys defined in .env.example (ignoring comments and empty lines)
EXAMPLE_KEYS=$(grep -E '^[A-Za-z0-9_]+=' "$EXAMPLE_FILE" | cut -d'=' -f1 | sort)
MISSING_KEYS=()

for key in $EXAMPLE_KEYS; do
    # Check if the key exists in .env
    if ! grep -qE "^$key=" "$ENV_FILE"; then
        MISSING_KEYS+=("$key")
    fi
done

if [ ${#MISSING_KEYS[@]} -gt 0 ]; then
    echo "======================================================================"
    echo "ERROR: The following keys are in .env.example but missing from .env:"
    for m_key in "${MISSING_KEYS[@]}"; do
        echo "  - $m_key"
    done
    echo "----------------------------------------------------------------------"
    echo "Please define these keys in your local .env to prevent runtime issues."
    echo "======================================================================"
    exit 1
fi

echo "  [OK] Environment variables are synchronized."
exit 0
