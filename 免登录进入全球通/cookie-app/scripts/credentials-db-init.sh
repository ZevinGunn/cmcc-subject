#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

cd "$ROOT_DIR"

CREDENTIALS_DATABASE_NAME="${CREDENTIALS_DATABASE_NAME:-cmcc_credentials}"
if ! [[ "$CREDENTIALS_DATABASE_NAME" =~ ^[A-Za-z0-9_-]+$ ]]; then
  echo "invalid CREDENTIALS_DATABASE_NAME: $CREDENTIALS_DATABASE_NAME"
  exit 1
fi

if use_docker_postgres; then
  ./scripts/db-up.sh
  ./scripts/db-wait.sh

  if run_docker_compose exec -T postgres psql \
    -U "${POSTGRES_USER:-cmcc_user}" \
    -d postgres \
    -tAc "SELECT 1 FROM pg_database WHERE datname = '$CREDENTIALS_DATABASE_NAME'" | grep -q 1; then
    echo "credentials database exists: $CREDENTIALS_DATABASE_NAME"
  else
    run_docker_compose exec -T postgres createdb \
      -U "${POSTGRES_USER:-cmcc_user}" \
      "$CREDENTIALS_DATABASE_NAME"
    echo "credentials database created: $CREDENTIALS_DATABASE_NAME"
  fi
else
  echo "using external PostgreSQL from CREDENTIALS_DATABASE_URL"
fi

run_node --import tsx api/scripts/init-credentials-db.ts
