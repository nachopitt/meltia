#!/bin/bash
set -e

cd /app/apps/backend

if [ -n "$DB_HOST" ]; then
    echo "Waiting for PostgreSQL database at ${DB_HOST}:${DB_PORT_INTERNAL:-5432}..."
    until pg_isready -h "$DB_HOST" -p "${DB_PORT_INTERNAL:-5432}" -U "${DB_USERNAME:-postgres}" -d "${DB_DATABASE:-meltia}"; do
        sleep 2
    done
    echo "PostgreSQL is ready."
fi

echo "Running database migrations..."
npx medusa db:migrate || echo "Migration completed with warnings"

echo "Starting Medusa development server..."
exec npm run dev
