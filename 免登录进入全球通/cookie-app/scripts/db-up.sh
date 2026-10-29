#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

if ! use_docker_postgres; then
  echo "skip postgres startup: USE_DOCKER_POSTGRES=${USE_DOCKER_POSTGRES:-0}"
  exit 0
fi

cd "$ROOT_DIR"
run_docker_compose up -d postgres

echo "postgres started"
