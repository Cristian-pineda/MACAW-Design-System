import { Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { Section } from '@/components/component-page/section';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { focusRing } from '@/components/docs-ui/focus';
import { blockHref, findBlock, readBlockSource, type BlockLevel } from '@/lib/blocks';
import { cn } from '@/lib/cn';
import { getComponentSummaries } from '@/lib/registry';
import { REGISTRY_BASE_URL } from '@/lib/site';
import { loadBlock, type BlockParams } from './load';

const LINK = cn(
  'rounded-xs text-body-md text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
  focusRing,
);

export async function BlockCodePage({ level, params }: BlockParams & { level: BlockLevel }) {
  const block = await loadBlock(level, { params });
  const source = await readBlockSource(block.slug);
  const titles = new Map(getComponentSummaries().map((c) => [c.slug, c.title]));
  const template = block.template ? findBlock('template', block.template) : undefined;

  return (
    <>
      <Section
        id="install"
        title="Add to your project"
        intro="Blocks are copied into your repo as a starting point. They import components from @macaw-ds/ui, so the components stay on the upgrade path while the composition is yours."
      >
        <div className="flex flex-col gap-1">
          <Text as="span" variant="label-sm" tone="secondary">
            With the MACAW CLI
          </Text>
          <CodeBlock
            code={`npx @macaw-ds/cli add ${block.slug}`}
            lang="bash"
            copyLabel="Copy CLI command"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text as="span" variant="label-sm" tone="secondary">
            With shadcn
          </Text>
          <CodeBlock
            code={`npx shadcn@latest add ${REGISTRY_BASE_URL}/r/${block.slug}.json`}
            lang="bash"
            copyLabel="Copy shadcn command"
          />
        </div>
        {template && (
          <Text variant="body-sm" tone="secondary">
            This page imports its template from{' '}
            <code className="font-mono text-code">
              ../{template.slug}/{template.slug}.tsx
            </code>
            , so the{' '}
            <Link href={blockHref(template)} className={LINK}>
              {template.name} template
            </Link>{' '}
            comes with it.
          </Text>
        )}
      </Section>

      <Section
        id="source"
        title="Source"
        intro={`packages/blocks/src/${block.slug}/${block.slug}.tsx, exactly what the CLI copies.`}
      >
        <CodeBlock code={source} lang="tsx" copyLabel="Copy source" />
      </Section>

      <Section id="uses" title="Uses" intro="The MACAW components this block composes.">
        <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
          {block.uses.map((slug) => (
            <li key={slug}>
              <Link href={`/components/${slug}`} className={LINK}>
                {titles.get(slug) ?? slug}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
