#!/bin/bash
set -e

# Change to application directory
cd /app

# Configure git safe directory for volume bind mounts
git config --global --add safe.directory /app 2>/dev/null || true

# =============================================================================
# PRODUCTION LIFECYCLE
# =============================================================================
if [ "$NODE_ENV" = "production" ]; then
    # Wait for PostgreSQL database
    if [ -n "$DB_HOST" ]; then
        echo "Waiting for PostgreSQL database at ${DB_HOST}:${DB_PORT_INTERNAL:-5432}..."
        until pg_isready -h "$DB_HOST" -p "${DB_PORT_INTERNAL:-5432}" -U "${DB_USERNAME:-postgres}" -d "${DB_DATABASE:-meltia}"; do
            sleep 2
        done
        echo "PostgreSQL is ready."
    fi

    # Run migrations if Medusa is present
    if [ -f "/app/node_modules/.bin/medusa" ]; then
        echo "Running database migrations..."
        npx medusa db:migrate || true
    fi

# =============================================================================
# DEVELOPMENT LIFECYCLE
# =============================================================================
else
    # Auto-install node_modules if missing from host mount
    if [ ! -d "/app/node_modules" ] && [ -f "/app/package.json" ]; then
        if mkdir /tmp/npm-install.lock 2>/dev/null; then
            echo "📦 Initializing node_modules inside container..."
            npm install
            rm -rf /tmp/npm-install.lock
        else
            echo "⏳ Waiting for parallel npm install..."
            while [ -d /tmp/npm-install.lock ]; do sleep 1; done
        fi
    fi

    # If running npm script that is not yet scaffolded, idle instead of crash looping
    if [ "$1" = "npm" ] && [ "$2" = "run" ] && [ -n "$3" ]; then
        SCRIPT_NAME="$3"
        if [ -f "/app/package.json" ]; then
            HAS_SCRIPT=$(node -e "try { const p = require('./package.json'); console.log(Boolean(p.scripts && p.scripts['$SCRIPT_NAME'])); } catch(e) { console.log('false'); }" 2>/dev/null || echo "false")
            if [ "$HAS_SCRIPT" != "true" ]; then
                echo "⏳ Script '$SCRIPT_NAME' not yet in package.json. Container idling (ready for scaffolding)."
                exec tail -f /dev/null
            fi
        fi
    fi
fi

# Execute container command
exec "$@"
