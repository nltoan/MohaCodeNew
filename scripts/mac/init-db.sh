#!/bin/bash
# One-time: create SQL Server container, restore the backup from db/*.zip, shrink log, apply migrations, create test admin.
# Needs Docker Desktop. Password files are generated under .dev/mac (git-ignored).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$HERE/../.." && pwd)"; DEV="$REPO/.dev/mac"
mkdir -p "$DEV/backup" "$DEV/logs" "$DEV/pids"; cd "$DEV"
[ -f sa-password.txt ] || { python3 -I -c "import secrets,string;a=string.ascii_letters+string.digits;print('Aa1!'+''.join(secrets.choice(a) for _ in range(24)))" > sa-password.txt; chmod 600 sa-password.txt; }
printf 'ACCEPT_EULA=Y\nMSSQL_SA_PASSWORD=%s\n' "$(cat sa-password.txt)" > mssql.env; chmod 600 mssql.env
sql() { docker exec -i -e SQLCMDPASSWORD="$(cat "$DEV/sa-password.txt")" moha-dev-mssql /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa "$@"; }
if ! docker inspect moha-dev-mssql >/dev/null 2>&1; then
  docker run -d --name moha-dev-mssql --platform linux/amd64 --env-file mssql.env -p 127.0.0.1:14333:1433 -v moha-dev-mssql-data:/var/opt/mssql mcr.microsoft.com/mssql/server:2022-latest
fi
docker start moha-dev-mssql >/dev/null 2>&1 || true
for _ in $(seq 1 60); do sql -Q "select 1" >/dev/null 2>&1 && break; sleep 3; done
ZIP="${1:-$(ls -t "$REPO"/db/*.zip | head -1)}"
if [ "$(sql -h -1 -W -Q "set nocount on; select count(*) from sys.databases where name='CongTTDT_MOHA_Dev'" | tr -d '[:space:]')" = "0" ]; then
  unzip -o "$ZIP" -d "$DEV/backup"; BAK="$(ls "$DEV"/backup/*.bak | head -1)"
  docker cp "$BAK" moha-dev-mssql:/var/opt/mssql/data/moha.bak
  FL="$(sql -h -1 -W -s'|' -Q "set nocount on; RESTORE FILELISTONLY FROM DISK='/var/opt/mssql/data/moha.bak'")"
  DATA="$(echo "$FL" | awk -F'|' '$3=="D"{print $1}')"; LOG="$(echo "$FL" | awk -F'|' '$3=="L"{print $1}')"
  sql -t 0 -Q "RESTORE DATABASE [CongTTDT_MOHA_Dev] FROM DISK='/var/opt/mssql/data/moha.bak' WITH MOVE '$DATA' TO '/var/opt/mssql/data/CongTTDT_MOHA_Dev.mdf', MOVE '$LOG' TO '/var/opt/mssql/data/CongTTDT_MOHA_Dev_log.ldf', REPLACE"
  sql -t 0 -Q "ALTER DATABASE [CongTTDT_MOHA_Dev] SET RECOVERY SIMPLE; USE [CongTTDT_MOHA_Dev]; CHECKPOINT; DBCC SHRINKFILE ($LOG, 256) WITH NO_INFOMSGS"
  docker exec moha-dev-mssql rm -f /var/opt/mssql/data/moha.bak
fi
for f in "$REPO"/db/migrations/*.sql; do  # strip UTF-8 BOM (sqlcmd on stdin rejects it)
  echo "migration: $(basename "$f")"; LC_ALL=C sed '1s/^\xEF\xBB\xBF//' "$f" | sql -d CongTTDT_MOHA_Dev -f 65001 -b -I >/dev/null
done
echo "done. Next: $HERE/restore-packages.sh ; python3 $HERE/build-api.py ; $HERE/start.sh"
