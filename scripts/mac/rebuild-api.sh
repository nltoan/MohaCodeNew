#!/bin/bash
# Recompile API.dll from current sources into .dev/mac/api-run and restart the API.
HERE="$(cd "$(dirname "$0")" && pwd)"
"$HERE/stop.sh" api
python3 "$HERE/build-api.py" || exit 1
"$HERE/start.sh" db && "$HERE/start.sh" api
