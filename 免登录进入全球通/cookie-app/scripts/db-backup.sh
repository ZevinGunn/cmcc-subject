#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_ENV="${APP_ENV:-${NODE_ENV:-development}}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.${APP_ENV}}"
DEFAULT_ENV_FILE="$ROOT_DIR/.env"

if [ -f "$DEFAULT_ENV_FILE" ]; then
  set -a
  . "$DEFAULT_ENV_FILE"
  set +a
fi

if [ -f "$ENV_FILE" ]; then
  set -a
  . "$ENV_FILE"
  set +a
fi

: "${DATABASE_URL:?DATABASE_URL is required}"

BACKUP_DIR="${PG_BACKUP_DIR:-$ROOT_DIR/backups/$APP_ENV}"
RETENTION_DAYS="${PG_BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date '+%Y%m%d-%H%M%S')"
OUTPUT_FILE="$BACKUP_DIR/cmcc-cookie-app-$APP_ENV-$STAMP.sql.gz"
PARTIAL_FILE="$OUTPUT_FILE.partial"

mkdir -p "$BACKUP_DIR"
trap 'rm -f "$PARTIAL_FILE"' EXIT

if command -v pg_dump >/dev/null 2>&1; then
  pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip > "$PARTIAL_FILE"
elif command -v docker >/dev/null 2>&1; then
  POSTGRES_CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-cmcc-cookie-app-postgres}"
  if ! docker inspect -f '{{.State.Running}}' "$POSTGRES_CONTAINER_NAME" 2>/dev/null | grep -q '^true$'; then
    echo "pg_dump is unavailable and PostgreSQL container is not running: $POSTGRES_CONTAINER_NAME" >&2
    exit 1
  fi
  docker exec "$POSTGRES_CONTAINER_NAME" pg_dump \
    -U "${POSTGRES_USER:-cmcc_user}" \
    -d "${POSTGRES_DB:-cmcc_cookie_app}" \
    --no-owner --no-privileges | gzip > "$PARTIAL_FILE"
else
  echo "pg_dump is required (host binary or running PostgreSQL Docker container)" >&2
  exit 1
fi

mv "$PARTIAL_FILE" "$OUTPUT_FILE"
trap - EXIT

find "$BACKUP_DIR" -type f -name '*.sql.gz' -mtime +"$RETENTION_DAYS" -delete

echo "backup created: $OUTPUT_FILE"
