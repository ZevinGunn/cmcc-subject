#!/bin/zsh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

node "proxy-server.js" & node "proxy-server2.js" &
sleep 1
open "http://127.0.0.1:3000/arpu.html" & open "http://127.0.0.1:3001/productSearch.html"

wait
