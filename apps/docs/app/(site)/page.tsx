import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { InvoiceSummary, LinkCards } from '@/components/home/showcase';
import { DEFINITION_OF_DONE } from '@/lib/site';

const INSTALL = 'npx @macaw-ds/cli init';

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="grid items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Badge tone="accent" variant="outline">
            Pre-release 0.x
          </Badge>
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
        <InvoiceSummary />
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
    </>
  );
}
