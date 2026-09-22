#!/bin/bash
set -e

cd /app/apps/storefront
export PORT="${PORT:-5173}"
export HOSTNAME="${BIND_HOST:-0.0.0.0}"

echo "Starting Storefront development server on ${HOSTNAME}:${PORT}..."
exec npm run dev
