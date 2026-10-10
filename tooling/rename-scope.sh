#!/usr/bin/env bash
# Renames the npm scope everywhere it appears. Usage: tooling/rename-scope.sh macaw-new
set -euo pipefail
NEW="${1:?usage: rename-scope.sh <new-scope-without-@>}"
OLD="macaw-ds"
cd "$(dirname "$0")/.."
FILES=$(grep -rl --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.next --exclude-dir=.turbo --exclude-dir=.git "@${OLD}" . || true)
for f in $FILES; do
  sed -i '' "s/@${OLD}/@${NEW}/g" "$f"
done
echo "Renamed @${OLD} → @${NEW} in $(echo "$FILES" | wc -l | tr -d ' ') files. Run pnpm install, then pnpm build."
