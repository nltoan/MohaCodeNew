#!/bin/bash
# Stops API, portal, admin (by listening port + pid file) and then the SQL container (never removes the volume).
# Usage: stop.sh [all|api|portal|admin]
HERE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$HERE/../.." && pwd)"; DEV="$REPO/.dev/mac"
what="${1:-all}"
stop_port() { # name port
  local pids; pids="$(lsof -ti "tcp:$2" -sTCP:LISTEN 2>/dev/null)"
  [ -f "$DEV/pids/$1.pid" ] && pids="$pids $(cat "$DEV/pids/$1.pid")"
  for p in $pids; do
    # kill children first (npm/pnpm spawn node), then the process itself
    pkill -TERM -P "$p" 2>/dev/null; kill -TERM "$p" 2>/dev/null
  done
  sleep 1
  for p in $(lsof -ti "tcp:$2" -sTCP:LISTEN 2>/dev/null); do kill -KILL "$p" 2>/dev/null; done
  rm -f "$DEV/pids/$1.pid"; echo "$1: stopped"
}
case "$what" in
  api) stop_port api 55104 ;;
  portal) stop_port portal 5173 ;;
  admin) stop_port admin 5174 ;;
  all) stop_port admin 5174; stop_port portal 5173; stop_port api 55104
       docker stop moha-dev-mssql >/dev/null 2>&1 && echo "db: stopped" ;;
  *) echo "usage: $0 [all|api|portal|admin]"; exit 2 ;;
esac
