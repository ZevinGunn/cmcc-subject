#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

LEGACY_DATABASE_URL="${LEGACY_DATABASE_URL:-${SOURCE_DATABASE_URL:-}}"
if [ -z "$LEGACY_DATABASE_URL" ]; then
  echo "LEGACY_DATABASE_URL or SOURCE_DATABASE_URL is required"
  exit 1
fi

legacy_backup_dir="${PG_BACKUP_DIR:-$ROOT_DIR/backups/$APP_ENV}/legacy"
stamp="$(date '+%Y%m%d-%H%M%S')"
output_file="$legacy_backup_dir/cmcc-cookie-app-legacy-$stamp.sql.gz"

mkdir -p "$legacy_backup_dir"

pg_dump "${LEGACY_DATABASE_URL%%\?schema=*}" --no-owner --no-privileges | gzip > "$output_file"

echo "legacy backup created: $output_file"
