#!/usr/bin/env bash
# Stop: a turn cannot end on a failing verify. Guards against loops with stop_hook_active.
set -u
. "$(dirname "$0")/_input.sh"
INPUT="$(cat)"
ACTIVE="$(printf '%s' "$INPUT" | macaw_json_field '.stop_hook_active')"
[ "$ACTIVE" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -d node_modules ] || exit 0
# Only when UI source changed since the last commit.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git diff --quiet HEAD -- '*.tsx' '*.ts' '*.jsx' '*.css' 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard -- '*.tsx' '*.ts' '*.jsx' '*.css')" ]; then
    exit 0
  fi
fi
OUT="$(macaw_pm_run verify 2>&1)"
STATUS=$?
if [ $STATUS -ne 0 ]; then
  printf 'verify failed. Fix these before finishing (show the passing output when done):\n%s\n' "$(printf '%s' "$OUT" | tail -n 60)" >&2
  exit 2
fi
exit 0
