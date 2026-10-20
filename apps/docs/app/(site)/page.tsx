import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Text } from '@macaw-ds/ui';
import Image from 'next/image';
import Link from 'next/link';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { InvoiceSummary, LinkCards } from '@/components/home/showcase';
import {
  CONTRIBUTING_URL,
  DEFINITION_OF_DONE,
  GITHUB_URL,
  IS_PRERELEASE,
  LICENSE_NAME,
  VERSION,
} from '@/lib/site';

const INSTALL = 'npx @macaw-ds/cli init';

export default function HomePage() {
  return (
    <div className="flex max-w-page flex-col gap-section px-margin py-section">
      <section aria-labelledby="hero-title" className="layout-grid items-center gap-y-section">
        <div className="col-span-12 flex flex-col gap-stack-md lg:col-span-6">
          <div className="flex items-center gap-stack-md">
            <Image
              src="/brand/macaw-mark-512.png"
              alt="MACAW"
              width={72}
              height={72}
              priority
              className="size-18 shrink-0"
            />
            <Badge tone="accent" variant="outline">
              {IS_PRERELEASE ? `v${VERSION} · Pre-release` : `v${VERSION}`}
            </Badge>
            <Badge tone="neutral" variant="outline">
              Open source · {LICENSE_NAME}
            </Badge>
          </div>
          <Text as="h1" variant="display-lg" id="hero-title">
            An agentic design system for financial software.
          </Text>
          <Text variant="body-lg" tone="secondary">
            Tokens, React components and the agent layer (manifests, skills, hooks, an MCP server)
            that lets Claude build correct screens without a human explaining it first. Dense,
            high-contrast, dashboard-first, light and dark as token modes.
          </Text>
          <blockquote className="m-0 border-l-2 border-status-accent-line pl-4">
            <Text variant="body-md" tone="secondary">
              <strong className="font-medium text-fg-primary">Definition of done.</strong>{' '}
              {DEFINITION_OF_DONE}
            </Text>
          </blockquote>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild iconEnd={<Icon name="arrow-right" />}>
              <Link href="/components">Browse components</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/tokens">Tokens</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/for-agents">For agents</Link>
            </Button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <InvoiceSummary />
        </div>
      </section>

      <section aria-labelledby="install-title" className="flex flex-col gap-3">
        <Text as="h2" variant="heading-lg" id="install-title">
          One door
        </Text>
        <Text tone="secondary">
          One command installs the packages and the Claude Code plugin, so the next session already
          knows the system.
        </Text>
        <CodeBlock code={INSTALL} lang="bash" copyLabel="Copy install command" />
      </section>

      <section aria-labelledby="pillars-title" className="flex flex-col gap-4">
        <Text as="h2" variant="heading-lg" id="pillars-title">
          What you get
        </Text>
        <LinkCards />
      </section>

      <section aria-labelledby="oss-title" className="flex flex-col gap-3">
        <Text as="h2" variant="heading-lg" id="oss-title">
          Open source
        </Text>
        <Text tone="secondary">
          MACAW is {LICENSE_NAME} licensed and built in the open. Read the source, file an issue, or
          propose a component: every decision is recorded in the repo, and the contributing guide
          has the checklist a change needs to land.
        </Text>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary" iconEnd={<Icon name="external-link" />}>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              View on GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
          <Button asChild variant="ghost" iconEnd={<Icon name="external-link" />}>
            <a href={CONTRIBUTING_URL} target="_blank" rel="noreferrer">
              Contributing guide<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
