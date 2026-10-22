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

# Run a step quietly, but print everything it wrote when it fails. pnpm reports install errors on
# stdout, so discarding stdout hid the reason the step failed.
quiet() {
  local log="$WORK/step.log"
  if ! "$@" >"$log" 2>&1; then
    echo "smoke: '$*' failed; its output:" >&2
    cat "$log" >&2
    return 1
  fi
}

PACKS="$WORK/packs"; mkdir -p "$PACKS"
if [ -z "$FROM_NPM" ]; then
  for p in tokens icons manifest eslint-config ui cli mcp; do
    (cd "$ROOT/packages/$p" && pnpm pack --pack-destination "$PACKS" >/dev/null)
  done
  ls "$PACKS"
fi

cd "$WORK"
npx --yes create-next-app@latest app --ts --tailwind --app --src-dir --no-eslint --use-pnpm --import-alias '@/*' --skip-install --yes >/dev/null 2>&1 || npx --yes create-next-app@latest app --ts --tailwind --app --src-dir --no-eslint --use-pnpm --yes
cd app
echo "smoke: pnpm $(pnpm --version) in the consumer app"
if [ -z "$FROM_NPM" ]; then
  # Unpublished builds: point every @macaw-ds/* range at the local tarballs so cross-package
  # ranges (workspace:^ → ^0.0.0) resolve without the npm registry.
  {
    echo "overrides:"
    for p in tokens icons manifest eslint-config ui cli mcp; do
      echo "  \"@macaw-ds/$p\": \"file:$(ls "$PACKS"/macaw-ds-$p-*.tgz)\""
    done
  } > pnpm-workspace.yaml
  quiet pnpm add -D "$PACKS"/macaw-ds-cli-*.tgz
else
  quiet pnpm add -D "@macaw-ds/cli@$FROM_NPM"
fi
# The one door: init installs ui, tokens, icons, eslint-config (+ eslint) and the plugin.
quiet pnpm exec macaw init
test -f .claude/skills/using-macaw/SKILL.md && test -f .claude/agents/macaw-reviewer.md && test -f .mcp.json && grep -q "macaw:start" CLAUDE.md && grep -q '"macaw"' .claude/settings.json
echo "smoke: macaw init ok"

# init wired the root CSS: the MACAW block sits after create-next-app's Tailwind import.
grep -q "macaw:start" src/app/globals.css && test "$(grep -c '@import "tailwindcss"' src/app/globals.css)" = 1
echo "smoke: root CSS wired by init"

cat > src/app/page.tsx <<'TSX'
// A React Server Component rendering every MACAW component, including the client ones
// (Button, Card) in states that attach handlers. This is the check jsdom unit tests cannot do.
import { Icon } from '@macaw-ds/icons';
import {
  AppShell, Badge, Button, Card, CardBody, CardHeader, CardTitle, Input, PageHeader, SideNav, TabNav, Text, TopBar,
} from '@macaw-ds/ui';

export default function Page() {
  return (
    <AppShell
      topBar={<TopBar brand={<Text as="span" variant="heading-md">Smoke</Text>} actions={<Button iconOnly variant="ghost" aria-label="Settings"><Icon name="settings" /></Button>} />}
      sideNav={<SideNav aria-label="Main"><SideNav.Group title="Billing"><SideNav.Item href="/" active>Invoices</SideNav.Item></SideNav.Group></SideNav>}
    >
      <PageHeader
        title="Smoke"
        meta={<Badge tone="success">Live</Badge>}
        actions={<Button data-testid="pay">Pay invoice</Button>}
        tabs={<TabNav aria-label="Sections"><TabNav.Item href="/" active>Overview</TabNav.Item></TabNav>}
      />
      <div className="layout-grid px-margin py-section">
        <div className="col-span-6">
          <Card>
            <CardHeader><CardTitle>Balance</CardTitle></CardHeader>
            <CardBody><Text numeric variant="numeric-lg" data-testid="amount">$12,480.00</Text></CardBody>
          </Card>
        </div>
        <div className="col-span-6 flex flex-col gap-2">
          <Text as="label" htmlFor="amt" variant="label-sm">Amount</Text>
          <Input id="amt" align="end" startAdornment="$" />
          <Button loading>Processing</Button>
          <Button asChild disabled><a href="/x">Disabled link</a></Button>
        </div>
      </div>
    </AppShell>
  );
}
TSX
quiet pnpm exec next build
echo "smoke: consumer build ok"

# What init sets up for Claude must pass on a fresh app (the Stop hook runs it).
quiet pnpm verify
echo "smoke: verify ok (eslint + tsc)"

# A page block through the one door: copies the page and the template it fills.
quiet pnpm exec macaw add billing-dashboard --skip-install
test -f src/components/macaw/blocks/billing-dashboard.tsx && test -f src/components/macaw/blocks/dashboard-template.tsx
mkdir -p src/app/dashboard
cat > src/app/dashboard/page.tsx <<'TSX'
import { BillingDashboard } from '@/components/macaw/blocks/billing-dashboard';

export default function Dashboard() {
  return <BillingDashboard />;
}
TSX
quiet pnpm exec next build
echo "smoke: macaw add billing-dashboard ok (page + template render from a server page)"

# Rendered CSS reaches the page: the built CSS must contain the token variable and the utility.
CSS_ALL="$(find .next/static -name '*.css' -exec cat {} +)"
printf '%s' "$CSS_ALL" | grep -q -- "--macaw-color-action-primary"
printf '%s' "$CSS_ALL" | grep -q "bg-action-primary"
echo "smoke: tokens and utilities present in built CSS"
echo "smoke: PASS"
