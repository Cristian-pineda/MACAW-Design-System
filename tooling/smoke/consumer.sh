#!/usr/bin/env bash
# Creates a fresh Next.js app in a temp dir, installs the packed MACAW packages, renders a themed
# Button and a numeric Text, builds, and asserts the token pipeline reaches the consumer.
# Usage: tooling/smoke/consumer.sh [--keep] [--from-npm <version>]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
KEEP=0; FROM_NPM=""
while [ $# -gt 0 ]; do
  case "$1" in
    --keep) KEEP=1 ;;
    --from-npm) FROM_NPM="$2"; shift ;;
  esac
  shift
done
command -v fnm >/dev/null 2>&1 && eval "$(fnm env 2>/dev/null)" || true

WORK="$(mktemp -d "${TMPDIR:-/tmp}/macaw-smoke.XXXXXX")"
echo "smoke: working in $WORK"
cleanup() { [ "$KEEP" = 1 ] && echo "smoke: kept $WORK" || rm -rf "$WORK"; }
trap cleanup EXIT

PACKS="$WORK/packs"; mkdir -p "$PACKS"
if [ -z "$FROM_NPM" ]; then
  for p in tokens icons manifest eslint-config ui cli mcp; do
    (cd "$ROOT/packages/$p" && pnpm pack --pack-destination "$PACKS" >/dev/null)
  done
  ls "$PACKS"
fi

cd "$WORK"
npx --yes create-next-app@latest app --ts --tailwind --app --src-dir --no-eslint --use-pnpm --no-import-alias --skip-install --yes >/dev/null 2>&1 || npx --yes create-next-app@latest app --ts --tailwind --app --src-dir --no-eslint --use-pnpm --yes
cd app
if [ -z "$FROM_NPM" ]; then
  pnpm add "$PACKS"/macaw-ds-tokens-*.tgz "$PACKS"/macaw-ds-icons-*.tgz "$PACKS"/macaw-ds-ui-*.tgz >/dev/null
  pnpm add -D "$PACKS"/macaw-ds-eslint-config-*.tgz "$PACKS"/macaw-ds-cli-*.tgz >/dev/null
else
  pnpm add "@macaw-ds/tokens@$FROM_NPM" "@macaw-ds/icons@$FROM_NPM" "@macaw-ds/ui@$FROM_NPM" >/dev/null
  pnpm add -D "@macaw-ds/eslint-config@$FROM_NPM" "@macaw-ds/cli@$FROM_NPM" >/dev/null
fi
pnpm install >/dev/null

cat > src/app/globals.css <<'CSS'
@import "tailwindcss";
@import "@macaw-ds/tokens/tokens.css";
@import "@macaw-ds/tokens/theme.css";
@import "@macaw-ds/ui/styles.css";
CSS
cat > src/app/page.tsx <<'TSX'
import { Button, Text } from '@macaw-ds/ui';

export default function Page() {
  return (
    <main className="flex flex-col gap-4 p-8">
      <Text as="h1" variant="heading-lg">Smoke</Text>
      <Text numeric variant="numeric-lg" data-testid="amount">$12,480.00</Text>
      <Button data-testid="pay">Pay invoice</Button>
    </main>
  );
}
TSX
pnpm exec next build >/dev/null
echo "smoke: consumer build ok"

# The CLI's one door, in the consumer repo.
pnpm exec macaw init --skip-install >/dev/null
test -f .claude/skills/using-macaw/SKILL.md && test -f .claude/agents/macaw-reviewer.md && test -f .mcp.json && grep -q "macaw:start" CLAUDE.md && grep -q '"macaw"' .claude/settings.json
echo "smoke: macaw init ok"

# Rendered CSS reaches the page: the built CSS must contain the token variable and the utility.
CSS_FILE="$(ls .next/static/css/*.css | head -1)"
grep -q -- "--macaw-color-action-primary" "$CSS_FILE" && grep -q "bg-action-primary" "$CSS_FILE"
echo "smoke: tokens and utilities present in built CSS"
echo "smoke: PASS"
