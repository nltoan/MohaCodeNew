#!/bin/bash
# Restores the NuGet packages API.csproj needs into .dev/mac/pkgs (needs the .NET SDK: ~/.dotnet/dotnet or `dotnet` on PATH).
HERE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$HERE/../.." && pwd)"
DOTNET="${DOTNET:-$(command -v dotnet || echo "$HOME/.dotnet/dotnet")}"
mkdir -p "$REPO/.dev/mac/restore"; cp "$HERE/restore-packages.csproj" "$REPO/.dev/mac/restore/r.csproj"
"$DOTNET" restore "$REPO/.dev/mac/restore/r.csproj" --packages "$REPO/.dev/mac/pkgs"
