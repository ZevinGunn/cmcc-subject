#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

cd "$ROOT_DIR"

bash scripts/credentials-db-init.sh
run_node --import tsx api/scripts/migrate-credentials-from-account.ts

echo "credentials migration completed"
