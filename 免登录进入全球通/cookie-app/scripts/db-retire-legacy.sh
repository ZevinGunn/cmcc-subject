#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

LEGACY_DB_HOST="${LEGACY_DB_HOST:-127.0.0.1}"
LEGACY_DB_PORT="${LEGACY_DB_PORT:-5432}"
LEGACY_DB_USER="${LEGACY_DB_USER:-ZevinGunn}"
LEGACY_DB_NAME="${LEGACY_DB_NAME:-cmcc_cookie_app}"

echo "retiring legacy database ${LEGACY_DB_NAME} on ${LEGACY_DB_HOST}:${LEGACY_DB_PORT}"

psql -h "$LEGACY_DB_HOST" -p "$LEGACY_DB_PORT" -U "$LEGACY_DB_USER" -d postgres <<SQL
ALTER DATABASE "$LEGACY_DB_NAME" SET default_transaction_read_only = on;
COMMENT ON DATABASE "$LEGACY_DB_NAME" IS 'LEGACY READ ONLY - Docker PostgreSQL on port 55432 is now the primary database.';
SQL

echo "legacy database marked as read-only"
