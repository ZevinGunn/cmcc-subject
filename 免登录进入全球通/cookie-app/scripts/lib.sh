#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_ENV="${APP_ENV:-${NODE_ENV:-development}}"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.${APP_ENV}}"
DEFAULT_ENV_FILE="$ROOT_DIR/.env"
DOCKER_ENV_FILE="${DOCKER_ENV_FILE:-$ROOT_DIR/.env.docker}"

load_env_files() {
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

  if [ -f "$DOCKER_ENV_FILE" ]; then
    set -a
    . "$DOCKER_ENV_FILE"
    set +a
  fi
}

use_docker_postgres() {
  local flag="${USE_DOCKER_POSTGRES:-1}"
  if [ "$flag" = "0" ] || [ "$flag" = "false" ] || [ "$flag" = "FALSE" ]; then
    return 1
  fi
  return 0
}

docker_compose_cmd() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return
  fi
  echo ""
}

run_docker_compose() {
  local compose_cmd
  compose_cmd="$(docker_compose_cmd)"
  if [ -z "$compose_cmd" ]; then
    echo "docker compose not found"
    return 1
  fi

  if [ -f "$DOCKER_ENV_FILE" ]; then
    if [ "$compose_cmd" = "docker compose" ]; then
      docker compose --env-file "$DOCKER_ENV_FILE" "$@"
      return
    fi
    docker-compose --env-file "$DOCKER_ENV_FILE" "$@"
    return
  fi

  if [ "$compose_cmd" = "docker compose" ]; then
    docker compose "$@"
    return
  fi
  docker-compose "$@"
}

node_bin() {
  if command -v node >/dev/null 2>&1; then
    command -v node
    return
  fi

  local bundled_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  if [ -x "$bundled_node" ]; then
    echo "$bundled_node"
    return
  fi

  echo "node not found" >&2
  return 1
}

run_node() {
  local bin
  bin="$(node_bin)"
  "$bin" "$@"
}
