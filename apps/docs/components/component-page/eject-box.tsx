import { Text } from '@macaw-ds/ui';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { formatBytes } from '@/lib/format';
import { REGISTRY_BASE_URL } from '@/lib/site';

export function EjectBox({ slug, budgetGzip }: { slug: string; budgetGzip: number }) {
  return (
    <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface-sunken p-4">
      <Text variant="body-sm" tone="secondary">
        Ejecting copies the source into your repo and records it in{' '}
        <code className="font-mono text-code">.macaw/ejected.json</code>, so the fork stays visible.
        The same file is served as a shadcn-compatible registry item.
      </Text>
      <div className="flex flex-col gap-1">
        <Text as="span" variant="label-sm" tone="secondary">
          With the MACAW CLI
        </Text>
        <CodeBlock
          code={`npx @macaw-ds/cli add ${slug} --eject`}
          lang="bash"
          copyLabel="Copy eject command"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Text as="span" variant="label-sm" tone="secondary">
          With shadcn
        </Text>
        <CodeBlock
          code={`npx shadcn@latest add ${REGISTRY_BASE_URL}/r/${slug}.json`}
          lang="bash"
          copyLabel="Copy shadcn command"
        />
      </div>
      <Text variant="caption" tone="muted">
        Bundle budget: {formatBytes(budgetGzip)} gzipped, enforced by size-limit in CI.
      </Text>
    </div>
  );
}
