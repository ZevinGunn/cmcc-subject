#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <backup.sql.gz>"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_ENV="${APP_ENV:-${NODE_ENV:-development}}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.${APP_ENV}}"
DEFAULT_ENV_FILE="$ROOT_DIR/.env"
INPUT_FILE="$1"

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

gunzip -c "$INPUT_FILE" | psql "$DATABASE_URL"

echo "restore completed from: $INPUT_FILE"
