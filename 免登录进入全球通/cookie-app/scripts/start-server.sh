#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

cd "$ROOT_DIR"

./scripts/db-init.sh
npm run server:dev
