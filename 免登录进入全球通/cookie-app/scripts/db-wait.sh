#!/usr/bin/env bash
set -euo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
load_env_files

if ! use_docker_postgres; then
  echo "skip postgres wait: USE_DOCKER_POSTGRES=${USE_DOCKER_POSTGRES:-0}"
  exit 0
fi

cd "$ROOT_DIR"

for _ in $(seq 1 30); do
  if run_docker_compose exec -T postgres pg_isready -U "${POSTGRES_USER:-cmcc_user}" -d "${POSTGRES_DB:-cmcc_cookie_app}" >/dev/null 2>&1; then
    echo "postgres is ready"
    exit 0
  fi
  sleep 2
done

echo "postgres not ready after timeout"
exit 1
