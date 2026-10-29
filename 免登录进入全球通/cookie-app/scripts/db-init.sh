#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

cd "$ROOT_DIR"

if use_docker_postgres; then
  ./scripts/db-up.sh
  ./scripts/db-wait.sh
else
  echo "using external PostgreSQL from DATABASE_URL"
fi

run_node ./node_modules/prisma/build/index.js generate
run_node ./node_modules/prisma/build/index.js migrate deploy
bash scripts/credentials-db-init.sh
run_node --import tsx api/scripts/import-json-if-db-empty.ts

echo "database init completed"
