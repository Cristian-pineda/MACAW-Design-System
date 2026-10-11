import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Section } from '@/components/component-page/section';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import { REPO_ROOT } from '@/lib/paths';
import { DocsPage } from '@/components/shell/docs-page';
import { MARKETPLACE_ADD } from '@/lib/site';
import { ScrollRegion } from '@/components/docs-ui/scroll-region';

export const metadata: Metadata = { title: 'For agents' };

const MCP_TOOLS = [
  {
    name: 'list_components',
    purpose:
      'Every component at the installed version with its status, category and purpose. Ask this before writing a component that might exist.',
  },
  {
    name: 'get_component',
    purpose:
      'The full manifest for one component: props, rules, accessibility contract, tokens used, examples and the starter snippet.',
  },
  {
    name: 'get_tokens',
    purpose:
      'The token metadata with light and dark values, so colour, space and type decisions resolve to real utilities.',
  },
  {
    name: 'validate',
    purpose:
      'Lints a JSX snippet with the consumer rules and reports className on MACAW components, raw values and not-in-system components.',
  },
];

const CLI = `npx @macaw-ds/cli init                 # packages, stylesheets, plugin, CLAUDE.md block
npx @macaw-ds/cli add button           # wires the import, prints the starter snippet
npx @macaw-ds/cli add button --eject   # copies the source in; recorded in .macaw/ejected.json
npx @macaw-ds/cli diff                 # (0.2) what ejected copies are behind`;

export default async function ForAgentsPage() {
  const template = await readFile(path.join(REPO_ROOT, 'plugin', 'templates', 'CLAUDE.md'), 'utf8');
  return (
    <DocsPage
      title="For agents"
      description="Context ships with the code. A rule in prose is advice; a rule in a hook, a type or a lint check is enforced (DECISIONS.md #16). This page is what Claude reads, and how it gets there."
    >
      <Section
        id="plugin"
        title="The plugin"
        intro="A Claude Code plugin with a skill, hooks, a reviewer agent and MCP config. The CLI installs it; it can also be added from the marketplace."
      >
        <CodeBlock
          code={`${MARKETPLACE_ADD}\nclaude plugin install macaw`}
          lang="bash"
          copyLabel="Copy marketplace command"
        />
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          <li className="text-body-md text-fg-secondary">
            <Text as="span" tone="secondary">
              <strong className="font-medium text-fg-primary">using-macaw skill</strong>: generated
              reference files for every component and token, loaded on demand.
            </Text>
          </li>
          <li className="text-body-md text-fg-secondary">
            <Text as="span" tone="secondary">
              <strong className="font-medium text-fg-primary">Hooks</strong>: lint after every edit,
              and run the project&apos;s verify script before a turn ends.
            </Text>
          </li>
          <li className="text-body-md text-fg-secondary">
            <Text as="span" tone="secondary">
              <strong className="font-medium text-fg-primary">macaw-reviewer agent</strong>: a
              fresh-context review for label association, heading order, one primary action and
              aria-label on icon-only buttons.
            </Text>
          </li>
          <li className="text-body-md text-fg-secondary">
            <Text as="span" tone="secondary">
              <strong className="font-medium text-fg-primary">MCP config</strong>: connects the{' '}
              <code className="font-mono text-code">macaw</code> server below.
            </Text>
          </li>
        </ul>
      </Section>

      <Section
        id="claude-md"
        title="The CLAUDE.md block"
        intro="init writes this block into the consumer's CLAUDE.md. It stays short and points at the skill."
      >
        <CodeBlock code={template} lang="md" copyLabel="Copy CLAUDE.md block" />
      </Section>

      <Section id="cli" title="The CLI" intro="One door for humans and agents alike.">
        <CodeBlock code={CLI} lang="bash" copyLabel="Copy CLI commands" />
      </Section>

      <Section
        id="mcp"
        title="MCP tools"
        intro="@macaw-ds/mcp exposes the generated registry over four tools."
      >
        <ScrollRegion label={'MCP tools'} className="rounded-container border border-line-default">
          <table className="w-full border-collapse">
            <thead className="bg-surface-layer-2">
              <tr>
                <th
                  scope="col"
                  className="border-b border-line-default px-3 py-2 text-start text-label-sm text-fg-secondary"
                >
                  Tool
                </th>
                <th
                  scope="col"
                  className="border-b border-line-default px-3 py-2 text-start text-label-sm text-fg-secondary"
                >
                  Returns
                </th>
              </tr>
            </thead>
            <tbody>
              {MCP_TOOLS.map((tool) => (
                <tr key={tool.name}>
                  <td className="border-b border-line-subtle px-3 py-2 align-top whitespace-nowrap">
                    <Text as="span" variant="code">
                      {tool.name}
                    </Text>
                  </td>
                  <td className="border-b border-line-subtle px-3 py-2 align-top">
                    <Text variant="body-sm">{tool.purpose}</Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      </Section>

      <Section
        id="manifest"
        title="The manifest is the contract"
        intro="Every component carries a schema-validated manifest. One source feeds the playground, the props table, the registry, the skill and the MCP tools."
      >
        <Text tone="secondary">
          The JSON schema is published at{' '}
          <a
            href="/schema/manifest.schema.json"
            className={cn(
              'rounded-xs font-mono text-code text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
              focusRing,
            )}
          >
            /schema/manifest.schema.json
          </a>
          . A manifest declares <code className="font-mono text-code">props</code> (with the control
          each one gets), <code className="font-mono text-code">a11y</code> (role, keyboard, name
          computation, notes), <code className="font-mono text-code">tokens</code>,{' '}
          <code className="font-mono text-code">rules</code>,{' '}
          <code className="font-mono text-code">dos</code> and{' '}
          <code className="font-mono text-code">donts</code>,{' '}
          <code className="font-mono text-code">examples</code> and a bundle{' '}
          <code className="font-mono text-code">budget</code>.
        </Text>
        <CodeBlock
          lang="json"
          copyLabel="Copy manifest excerpt"
          code={`{
  "name": "Button",
  "slug": "button",
  "purpose": "Triggers an action. Not navigation; for links use asChild with an anchor.",
  "props": {
    "variant": { "type": "enum", "values": ["primary", "secondary", "ghost", "destructive"], "default": "primary", "required": false, "description": "…" }
  },
  "a11y": { "role": "button", "keyboard": ["Tab: focus", "Enter, Space: activate"], "name": "From the visible label (children)", "notes": [] },
  "rules": ["One primary button per view."],
  "budget": { "gzip": 4000 }
}`}
        />
        <Text tone="secondary">
          Each manifest is also served as JSON at{' '}
          <code className="font-mono text-code">/r/&lt;slug&gt;.json</code> in shadcn registry
          format, which is what <code className="font-mono text-code">add --eject</code> and{' '}
          <code className="font-mono text-code">npx shadcn add</code> read.
        </Text>
      </Section>
    </DocsPage>
  );
}
