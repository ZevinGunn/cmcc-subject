#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_ENV="${APP_ENV:-development}"
TARGET_ENV_FILE="$ROOT_DIR/.env.${APP_ENV}"
TARGET_DOCKER_FILE="$ROOT_DIR/.env.docker"

generate_base64_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
}

generate_token() {
  node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
}

sync_database_url_from_docker_env() {
  if [ ! -f "$TARGET_ENV_FILE" ] || [ ! -f "$TARGET_DOCKER_FILE" ]; then
    return
  fi

  local use_docker="1"
  if grep -q '^USE_DOCKER_POSTGRES=' "$TARGET_ENV_FILE"; then
    use_docker="$(grep '^USE_DOCKER_POSTGRES=' "$TARGET_ENV_FILE" | tail -n 1 | cut -d '=' -f 2 | tr -d "\"'" | tr -d '[:space:]')"
  fi
  if [ "$use_docker" = "0" ] || [ "$use_docker" = "false" ] || [ "$use_docker" = "FALSE" ]; then
    echo "skip DATABASE_URL sync: USE_DOCKER_POSTGRES=$use_docker"
    return
  fi

  POSTGRES_USER=""
  POSTGRES_PASSWORD=""
  POSTGRES_DB=""
  POSTGRES_PORT=""

  set -a
  . "$TARGET_DOCKER_FILE"
  set +a

  POSTGRES_USER="${POSTGRES_USER:-cmcc_user}"
  POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-CHANGE_ME_LOCAL_PASSWORD}"
  POSTGRES_DB="${POSTGRES_DB:-cmcc_cookie_app}"
  POSTGRES_PORT="${POSTGRES_PORT:-5432}"

  db_url="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
  credentials_database_name="${CREDENTIALS_DATABASE_NAME:-cmcc_credentials}"
  credentials_db_url="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/${credentials_database_name}?schema=public"

  if grep -q '^DATABASE_URL=' "$TARGET_ENV_FILE"; then
    sed -i.bak "s|^DATABASE_URL=.*$|DATABASE_URL=\"$db_url\"|g" "$TARGET_ENV_FILE"
    rm -f "$TARGET_ENV_FILE.bak"
  else
    printf '\nDATABASE_URL="%s"\n' "$db_url" >> "$TARGET_ENV_FILE"
  fi

  if grep -q '^CREDENTIALS_DATABASE_URL=' "$TARGET_ENV_FILE"; then
    sed -i.bak "s|^CREDENTIALS_DATABASE_URL=.*$|CREDENTIALS_DATABASE_URL=\"$credentials_db_url\"|g" "$TARGET_ENV_FILE"
    rm -f "$TARGET_ENV_FILE.bak"
  else
    printf 'CREDENTIALS_DATABASE_URL="%s"\n' "$credentials_db_url" >> "$TARGET_ENV_FILE"
  fi

  echo "synced DATABASE_URL and CREDENTIALS_DATABASE_URL in $TARGET_ENV_FILE from $TARGET_DOCKER_FILE"
}

if [ ! -f "$TARGET_ENV_FILE" ]; then
  cp "$ROOT_DIR/.env.${APP_ENV}.example" "$TARGET_ENV_FILE"
  if grep -q 'base64-32-bytes' "$TARGET_ENV_FILE"; then
    key="$(generate_base64_key)"
    sed -i.bak "s|base64-32-bytes|$key|g" "$TARGET_ENV_FILE"
    rm -f "$TARGET_ENV_FILE.bak"
  fi
  if grep -q 'replace-with-a-long-random-key' "$TARGET_ENV_FILE"; then
    admin_key="$(generate_token)"
    sed -i.bak "s|replace-with-a-long-random-key|$admin_key|g" "$TARGET_ENV_FILE"
    rm -f "$TARGET_ENV_FILE.bak"
  fi
  if grep -q 'replace-with-worker-key' "$TARGET_ENV_FILE"; then
    worker_key="$(generate_token)"
    sed -i.bak "s|replace-with-worker-key|$worker_key|g" "$TARGET_ENV_FILE"
    rm -f "$TARGET_ENV_FILE.bak"
  fi
  echo "created $TARGET_ENV_FILE"
else
  echo "skip $TARGET_ENV_FILE: already exists"
fi

if [ ! -f "$TARGET_DOCKER_FILE" ]; then
  cp "$ROOT_DIR/.env.docker.example" "$TARGET_DOCKER_FILE"
  if grep -q 'replace-with-a-strong-password' "$TARGET_DOCKER_FILE"; then
    db_password="$(generate_token)"
    sed -i.bak "s|replace-with-a-strong-password|$db_password|g" "$TARGET_DOCKER_FILE"
    rm -f "$TARGET_DOCKER_FILE.bak"
  fi
  echo "created $TARGET_DOCKER_FILE"
else
  echo "skip $TARGET_DOCKER_FILE: already exists"
fi

sync_database_url_from_docker_env

echo "environment setup complete for APP_ENV=$APP_ENV"
