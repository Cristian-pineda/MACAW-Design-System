#!/usr/bin/env bash
# Stop hook: a turn cannot end on a failing build. Runs the fast gates only; full verify runs in CI.
set -u
INPUT="$(cat)"
ACTIVE="$(printf '%s' "$INPUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(String(JSON.parse(s).stop_hook_active===true))}catch{process.stdout.write("false")}})')"
[ "$ACTIVE" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
command -v fnm >/dev/null 2>&1 && eval "$(fnm env 2>/dev/null)"
[ -d node_modules ] || exit 0
# Only run when something changed in a tracked source area.
if git diff --quiet HEAD -- packages apps plugin tooling 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard packages apps plugin tooling)" ]; then
  exit 0
fi
OUT="$(pnpm turbo run lint typecheck test --output-logs=errors-only 2>&1)"
STATUS=$?
if [ $STATUS -ne 0 ]; then
  printf 'pnpm turbo run lint typecheck test failed. Fix these before finishing:\n%s\n' "$(printf '%s' "$OUT" | tail -n 60)" >&2
  exit 2
fi
exit 0
