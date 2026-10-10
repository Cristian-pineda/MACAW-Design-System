import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { EjectBox } from '@/components/component-page/eject-box';
import { PropsTable } from '@/components/component-page/props-table';
import { Section } from '@/components/component-page/section';
import { TokensUsed } from '@/components/component-page/tokens-used';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { REGISTRY_DIR } from '@/lib/paths';
import { componentStaticParams, loadComponent, type SlugParams } from '../params';

export const dynamicParams = false;
export const generateStaticParams = componentStaticParams;

export async function generateMetadata(props: SlugParams): Promise<Metadata> {
  const { manifest } = await loadComponent(props);
  return { title: `${manifest.name} code` };
}

export default async function ComponentCodePage(props: SlugParams) {
  const { slug, manifest } = await loadComponent(props);
  const raw = await readFile(path.join(REGISTRY_DIR, 'manifests', `${slug}.json`), 'utf8');

  return (
    <>
      <Section id="import" title="Import">
        <CodeBlock
          code={`import { ${manifest.exports.join(', ')} } from '${manifest.package}';`}
          lang="tsx"
          copyLabel="Copy import"
        />
      </Section>

      <Section id="props" title="Props">
        <PropsTable manifest={manifest} />
      </Section>

      {manifest.slots.length > 0 && (
        <Section id="slots" title="Slots" intro="Named parts you pass content into.">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {manifest.slots.map((s) => (
              <li key={s}>
                <Text as="span" variant="code">
                  {s}
                </Text>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id="tokens"
        title="Tokens used"
        intro="Every value this component renders comes from one of these tokens."
      >
        <TokensUsed names={manifest.tokens} />
      </Section>

      <Section id="eject" title="Eject">
        <EjectBox slug={slug} budgetGzip={manifest.budget.gzip} />
      </Section>

      <Section
        id="manifest"
        title="Manifest"
        intro={`registry/manifests/${slug}.json, the contract the playground, CLI, plugin and MCP server read.`}
      >
        <CodeBlock code={raw} lang="json" copyLabel="Copy manifest" />
      </Section>
    </>
  );
}
