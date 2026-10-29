#!/usr/bin/env sh
set -eu

APP_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PORT="${PORT:-8788}"
PM2_APP_NAME="${PM2_APP_NAME:-bmcc-backend}"
PM2_PID_DIR="${PM2_HOME:-$HOME/.pm2}/pids"
PM2_BIN=""

echo "Preparing BJ Mobile business local backend on port $PORT..."

if command -v pm2 >/dev/null 2>&1; then
  PM2_BIN="$(command -v pm2)"
elif [ -x "$HOME/.nvm/versions/node/v18.20.8/bin/pm2" ]; then
  PM2_BIN="$HOME/.nvm/versions/node/v18.20.8/bin/pm2"
elif [ -x "$HOME/.nvm/versions/node/v22.22.3/bin/pm2" ]; then
  PM2_BIN="$HOME/.nvm/versions/node/v22.22.3/bin/pm2"
fi

if [ -n "$PM2_BIN" ]; then
  echo "Stopping PM2 app if present: $PM2_APP_NAME"
  "$PM2_BIN" delete "$PM2_APP_NAME" >/dev/null 2>&1 || "$PM2_BIN" stop "$PM2_APP_NAME" >/dev/null 2>&1 || true
fi

if [ -d "$PM2_PID_DIR" ]; then
  for PM2_PID_FILE in "$PM2_PID_DIR"/"$PM2_APP_NAME"-*.pid; do
    [ -f "$PM2_PID_FILE" ] || continue
    PM2_CHILD_PID="$(cat "$PM2_PID_FILE" 2>/dev/null || true)"
    if [ -n "$PM2_CHILD_PID" ]; then
      echo "Stopping PM2-managed backend process from $PM2_PID_FILE: $PM2_CHILD_PID"
      kill "$PM2_CHILD_PID" 2>/dev/null || true
      sleep 1
    fi
  done
fi

PIDS_BY_PORT="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$PIDS_BY_PORT" ]; then
  echo "Stopping process(es) listening on port $PORT: $PIDS_BY_PORT"
  kill $PIDS_BY_PORT 2>/dev/null || true
  sleep 1
fi

for _ in 1 2 3 4 5 6 7 8 9 10; do
  REMAINING_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -z "$REMAINING_PIDS" ]; then
    break
  fi
  echo "Stopping process(es) that reoccupied port $PORT: $REMAINING_PIDS"
  kill $REMAINING_PIDS 2>/dev/null || true
  sleep 1
done

REMAINING_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$REMAINING_PIDS" ]; then
  echo "Force stopping remaining process(es) on port $PORT: $REMAINING_PIDS"
  kill -9 $REMAINING_PIDS 2>/dev/null || true
  sleep 1
fi

REMAINING_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$REMAINING_PIDS" ]; then
  echo "Port $PORT is still occupied by: $REMAINING_PIDS"
  exit 1
fi

cd "$APP_DIR"
echo "Starting backend..."
exec npm start
