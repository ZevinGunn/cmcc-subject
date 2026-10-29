#!/bin/zsh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

node "proxy-server.js" &
sleep 1
open "http://127.0.0.1:3000/arpu.html"

wait
