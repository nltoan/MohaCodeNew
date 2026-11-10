#!/bin/bash
# Starts (idempotently) SQL Server container, API (Mono/OWIN), portal (5173) and admin (5174).
# Usage: start.sh [all|db|api|portal|admin]
HERE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$HERE/../.." && pwd)"; DEV="$REPO/.dev/mac"
export PATH="/opt/homebrew/bin:$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -1)/bin:$PATH"
mkdir -p "$DEV/logs" "$DEV/pids"
what="${1:-all}"
listening() { lsof -ti "tcp:$1" -sTCP:LISTEN >/dev/null 2>&1; }
wait_port() { for _ in $(seq 1 "${2:-90}"); do listening "$1" && return 0; sleep 1; done; return 1; }

start_db() {
  if [ "$(docker inspect -f '{{.State.Running}}' moha-dev-mssql 2>/dev/null)" != "true" ]; then
    docker start moha-dev-mssql >/dev/null || { echo "ERROR: container moha-dev-mssql missing (see CHAY-THU-TREN-MAC.md)"; return 1; }
  fi
  for _ in $(seq 1 60); do
    docker exec -e SQLCMDPASSWORD="$(cat "$DEV/sa-password.txt")" moha-dev-mssql /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -Q "select 1" >/dev/null 2>&1 && { echo "db: ready (127.0.0.1:14333)"; return 0; }
    sleep 2
  done
  echo "db: NOT ready"; return 1
}
start_api() {
  if listening 55104; then echo "api: already running"; return 0; fi
  [ -f "$DEV/api-run/MohaDevHost.exe" ] || { echo "api: build first: $HERE/rebuild-api.sh"; return 1; }
  ( cd "$DEV/api-run" && exec nohup mono --debug MohaDevHost.exe > "$DEV/logs/api.log" 2>&1 < /dev/null ) &
  echo $! > "$DEV/pids/api.pid"
  wait_port 55104 60 && echo "api: http://localhost:55104" || echo "api: FAILED, see $DEV/logs/api.log"
}
start_portal() {
  if listening 5173; then echo "portal: already running"; return 0; fi
  ( cd "$REPO/frontend" && exec nohup pnpm dev > "$DEV/logs/portal.log" 2>&1 < /dev/null ) &
  echo $! > "$DEV/pids/portal.pid"
  wait_port 5173 60 && echo "portal: http://localhost:5173" || echo "portal: FAILED, see $DEV/logs/portal.log"
}
start_admin() {
  if listening 5174; then echo "admin: already running"; return 0; fi
  ( cd "$REPO/backend" && BROWSER=none exec nohup npm start > "$DEV/logs/admin.log" 2>&1 < /dev/null ) &
  echo $! > "$DEV/pids/admin.pid"
  wait_port 5174 180 && echo "admin: http://localhost:5174" || echo "admin: FAILED, see $DEV/logs/admin.log"
}
case "$what" in
  db) start_db ;;
  api) start_api ;;
  portal) start_portal ;;
  admin) start_admin ;;
  all) start_db && start_api; start_portal; start_admin ;;
  *) echo "usage: $0 [all|db|api|portal|admin]"; exit 2 ;;
esac
