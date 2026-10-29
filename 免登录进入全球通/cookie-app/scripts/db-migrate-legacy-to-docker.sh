#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

SOURCE_DATABASE_URL="${SOURCE_DATABASE_URL:-${DATABASE_URL:-}}"
if [ -z "$SOURCE_DATABASE_URL" ]; then
  echo "SOURCE_DATABASE_URL or DATABASE_URL is required"
  exit 1
fi

strip_prisma_schema_query() {
  local url="$1"
  echo "${url%%\?schema=*}"
}

POSTGRES_USER="${POSTGRES_USER:-cmcc_user}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-CHANGE_ME_LOCAL_PASSWORD}"
POSTGRES_DB="${POSTGRES_DB:-cmcc_cookie_app}"
POSTGRES_PORT="${POSTGRES_PORT:-55432}"

TARGET_DATABASE_URL="${TARGET_DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public}"
SOURCE_DATABASE_URL_CLI="$(strip_prisma_schema_query "$SOURCE_DATABASE_URL")"
TARGET_DATABASE_URL_CLI="$(strip_prisma_schema_query "$TARGET_DATABASE_URL")"

BACKUP_DIR="${PG_BACKUP_DIR:-$ROOT_DIR/backups/$APP_ENV}"
STAMP="$(date '+%Y%m%d-%H%M%S')"
TARGET_BACKUP_FILE="$BACKUP_DIR/pre-migrate-docker-target-$STAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "source: $SOURCE_DATABASE_URL_CLI"
echo "target: $TARGET_DATABASE_URL_CLI"

echo "checking source database..."
psql "$SOURCE_DATABASE_URL_CLI" -c 'select count(*) as accounts from "Account"; select count(*) as links from "PublicLink";'

echo "ensuring target schema exists..."
DATABASE_URL="$TARGET_DATABASE_URL" "$ROOT_DIR/node_modules/.bin/prisma" migrate deploy

echo "checking target database..."
psql "$TARGET_DATABASE_URL_CLI" -c 'select count(*) as accounts from "Account"; select count(*) as links from "PublicLink";'

echo "backing up target database to $TARGET_BACKUP_FILE"
pg_dump "$TARGET_DATABASE_URL_CLI" --no-owner --no-privileges | gzip > "$TARGET_BACKUP_FILE"

echo "truncating target business tables..."
psql "$TARGET_DATABASE_URL_CLI" <<'SQL'
TRUNCATE TABLE "PublicLinkAccount", "LogEntry", "PublicLink", "Account" RESTART IDENTITY CASCADE;
SQL

echo "copying source data into target..."
pg_dump "$SOURCE_DATABASE_URL_CLI" \
  --data-only \
  --exclude-table='_prisma_migrations' \
  --no-owner \
  --no-privileges | psql "$TARGET_DATABASE_URL_CLI"

echo "verifying target database..."
psql "$TARGET_DATABASE_URL_CLI" -c 'select count(*) as accounts from "Account"; select count(*) as links from "PublicLink"; select min("updatedAt") as oldest, max("updatedAt") as newest from "Account";'

echo "migration completed"
echo "target backup saved at: $TARGET_BACKUP_FILE"
