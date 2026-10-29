#!/usr/bin/env sh
set -eu

APP_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PORT="${PORT:-7399}"
SERVER_PATH="$APP_DIR/src/server.js"

echo "Preparing Yunpan login local server on port $PORT..."

PIDS_BY_PORT="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$PIDS_BY_PORT" ]; then
  echo "Stopping process(es) listening on port $PORT: $PIDS_BY_PORT"
  kill $PIDS_BY_PORT 2>/dev/null || true
  sleep 1
fi

PIDS_BY_APP="$(pgrep -f "node .*${SERVER_PATH}" 2>/dev/null || true)"
if [ -n "$PIDS_BY_APP" ]; then
  echo "Stopping previous Yunpan server process(es): $PIDS_BY_APP"
  kill $PIDS_BY_APP 2>/dev/null || true
  sleep 1
fi

REMAINING_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$REMAINING_PIDS" ]; then
  echo "Force stopping remaining process(es) on port $PORT: $REMAINING_PIDS"
  kill -9 $REMAINING_PIDS 2>/dev/null || true
  sleep 1
fi

cd "$APP_DIR"
echo "Starting server..."
exec npm start
