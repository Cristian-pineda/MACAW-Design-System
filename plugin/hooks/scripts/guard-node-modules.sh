#!/usr/bin/env bash
# PreToolUse: never edit installed MACAW packages. Eject instead (npx @macaw-ds/cli add <name> --eject).
set -u
. "$(dirname "$0")/_input.sh"
INPUT="$(cat)"
FILE="$(printf '%s' "$INPUT" | macaw_json_field '.tool_input.file_path')"
case "$FILE" in
  *node_modules/@macaw-ds/*)
    echo "MACAW: $FILE is an installed package. Do not edit it; use a variant prop, or run 'npx @macaw-ds/cli add <name> --eject' to take ownership of a copy." >&2
    exit 2 ;;
esac
exit 0
