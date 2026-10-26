#!/bin/sh
set -eu

if [ "${DB_PUSH:-false}" = "true" ]; then
  echo "==> Syncing database schema (prisma db push)..."
  ./node_modules/.bin/prisma db push
elif [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "==> Applying database migrations..."
  ./node_modules/.bin/prisma migrate deploy
fi

if [ "${SEED_DB:-false}" = "true" ]; then
  echo "==> Seeding database (idempotent)..."
  ./node_modules/.bin/tsx prisma/seed.ts
fi

# The production app image runs as uid 1001 (nextjs). A Docker named volume
# that was created by an older/root-owned container may still be root-owned,
# so normalise its ownership before the app starts.
if [ -d /app/data ]; then
  chown -R 1001:1001 /app/data 2>/dev/null || true
fi

echo "==> Database is ready."
exec "$@"
