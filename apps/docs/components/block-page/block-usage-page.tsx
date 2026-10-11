import { Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { RulesList } from '@/components/component-page/rules-list';
import { Section } from '@/components/component-page/section';
import { focusRing } from '@/components/docs-ui/focus';
import { blockHref, findBlock, getBlocksByLevel, type BlockLevel } from '@/lib/blocks';
import { cn } from '@/lib/cn';
import { loadBlock, type BlockParams } from './load';

const LINK = cn(
  'rounded-xs text-body-md text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
  focusRing,
);

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-2 pl-6">
      {items.map((item) => (
        <li key={item} className="pl-1 text-body-md text-fg-primary">
          <Text as="span">{item}</Text>
        </li>
      ))}
    </ul>
  );
}

export async function BlockUsagePage({ level, params }: BlockParams & { level: BlockLevel }) {
  const block = await loadBlock(level, { params });
  const template = block.template ? findBlock('template', block.template) : undefined;
  const filledBy =
    block.level === 'template'
      ? getBlocksByLevel('page').filter((page) => page.template === block.slug)
      : [];

  return (
    <>
      <Text tone="secondary">{block.description}</Text>

      {template && (
        <Section id="template" title="Fills template">
          <Text>
            <Link href={blockHref(template)} className={LINK}>
              {template.name} template
            </Link>
          </Text>
        </Section>
      )}

      {block.level === 'template' && (
        <Section id="filled-by" title="Filled by pages">
          {filledBy.length > 0 ? (
            <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
              {filledBy.map((page) => (
                <li key={page.slug}>
                  <Link href={blockHref(page)} className={LINK}>
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Text tone="secondary">No page fills this template yet.</Text>
          )}
        </Section>
      )}

      <Section id="when-to-use" title="When to use">
        <Bullets items={block.whenToUse} />
      </Section>

      {block.whenNotToUse.length > 0 && (
        <Section id="when-not-to-use" title="When not to use">
          <Bullets items={block.whenNotToUse} />
        </Section>
      )}

      {block.rules.length > 0 && (
        <Section
          id="rules"
          title="Rules"
          intro="Hard rules for this composition. Keep them when you adapt the copy in your repo."
        >
          <RulesList rules={block.rules} />
        </Section>
      )}
    </>
  );
}
