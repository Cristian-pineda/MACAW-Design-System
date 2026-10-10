#!/usr/bin/env bash
# PostToolUse hook: lint and format the file Claude just edited. Non-blocking; messages go back to Claude.
set -u
INPUT="$(cat)"
FILE="$(printf '%s' "$INPUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(j.tool_input?.file_path||"")}catch{}})')"
[ -z "$FILE" ] && exit 0
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs) ;;
  *) exit 0 ;;
esac
case "$FILE" in
  */node_modules/*|*/dist/*|*/.next/*|*/registry/*|*/templates/*) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
command -v fnm >/dev/null 2>&1 && eval "$(fnm env 2>/dev/null)"
[ -d node_modules ] || exit 0
pnpm exec prettier --log-level warn --write "$FILE" >/dev/null 2>&1
OUT="$(pnpm exec eslint --no-warn-ignored --fix "$FILE" 2>&1)"
STATUS=$?
if [ $STATUS -ne 0 ]; then
  printf 'MACAW lint found problems in %s:\n%s\n' "$FILE" "$OUT" >&2
  exit 2
fi
exit 0
