#!/usr/bin/env bash
# PostToolUse: lint the file Claude just edited with the MACAW rules. Exit 2 feeds the messages back to Claude.
set -u
. "$(dirname "$0")/_input.sh"
INPUT="$(cat)"
FILE="$(printf '%s' "$INPUT" | macaw_json_field '.tool_input.file_path')"
[ -z "$FILE" ] && exit 0
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs) ;;
  *) exit 0 ;;
esac
case "$FILE" in
  */node_modules/*|*/dist/*|*/.next/*) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -d node_modules ] || exit 0
OUT="$(macaw_pm_exec eslint --no-warn-ignored --fix "$FILE" 2>&1)"
STATUS=$?
if [ $STATUS -ne 0 ]; then
  printf 'MACAW lint found problems in %s:\n%s\n' "$FILE" "$OUT" >&2
  exit 2
fi
exit 0
