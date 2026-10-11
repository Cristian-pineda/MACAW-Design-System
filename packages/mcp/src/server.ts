#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { listManifests, loadBlock, loadIndex, loadManifest, loadTokens } from './registry.ts';
import { validate } from './tools/validate.ts';

export function createServer(): McpServer {
  const server = new McpServer({ name: 'macaw', version: '0.0.0' });

  server.registerTool(
    'list_components',
    {
      title: 'List MACAW components',
      description:
        'Every component in the installed MACAW version grouped by atomic level (atom, molecule, organism, template) with purpose, status, exports and budget, plus the templates and pages you can copy in with `macaw add`. Call before choosing a component; anything not listed is not-in-system.',
      inputSchema: {},
    },
    async () => {
      const index = await loadIndex();
      const items = index.items
        .filter((i) => i.type === 'registry:ui')
        .map((i) => ({
          name: i.name,
          title: i.title,
          purpose: i.description,
          ...(i.meta?.macaw ?? {}),
        }));
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                version: index.meta.macaw.version,
                scope: index.meta.macaw.scope,
                levels: ['atom', 'molecule', 'organism', 'template', 'page'],
                components: items,
                blocks: index.items
                  .filter((i) => i.type === 'registry:block')
                  .map((i) => ({
                    name: i.name,
                    title: i.title,
                    purpose: i.description,
                    install: `npx @macaw-ds/cli add ${i.name}`,
                    ...(i.meta?.macaw ?? {}),
                  })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get a MACAW component manifest',
      description:
        'The full contract for one component: props with allowed values and defaults, slots, tokens, accessibility (role, keyboard, name), rules, dos, donts and examples. For a template or page, returns its manifest and source code to start a screen from. Read it before using the component.',
      inputSchema: {
        name: z
          .string()
          .describe('Component, template or page slug, e.g. "button" or "dashboard-template"'),
      },
    },
    async ({ name }) => {
      const slugs = await listManifests();
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const block = await loadBlock(slug);
      if (block) {
        return { content: [{ type: 'text', text: JSON.stringify(block, null, 2) }] };
      }
      if (!slugs.includes(slug)) {
        return {
          content: [
            { type: 'text', text: JSON.stringify({ notInSystem: name, available: slugs }) },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(await loadManifest(slug), null, 2) }],
      };
    },
  );

  server.registerTool(
    'get_tokens',
    {
      title: 'Get MACAW tokens',
      description:
        'Design tokens with light and dark values and the Tailwind utility they produce. Filter by group (color, color.action, text, shape, elevation, space, duration) and tier (primitive, semantic, component). Use utilities, never raw values.',
      inputSchema: {
        group: z
          .string()
          .optional()
          .describe('Dotted prefix such as "color.action" or "text.size"'),
        tier: z.enum(['primitive', 'semantic', 'component']).optional(),
      },
    },
    async ({ group, tier }) => {
      const { version, prefix, tokens } = await loadTokens();
      const filtered = tokens
        .filter((t) => !group || t.name === group || t.name.startsWith(`${group}.`))
        .filter((t) => !tier || t.tier === tier)
        .map((t) => ({
          name: t.name,
          cssVar: t.cssVar,
          utility: utilityFor(t.path, t.tier),
          tier: t.tier,
          type: t.type,
          light: t.value.light,
          dark: t.value.dark,
          description: t.description,
        }));
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { version, prefix, count: filtered.length, tokens: filtered },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    'validate',
    {
      title: 'Validate a MACAW snippet',
      description:
        'Runs the MACAW lint rules on JSX/TSX (raw values, arbitrary Tailwind values, className on MACAW components, unknown classes, jsx-a11y) and reports components that are not in the system. Call before reporting work as done.',
      inputSchema: {
        code: z.string().describe('File contents or a JSX snippet'),
        filename: z
          .string()
          .optional()
          .describe('Used for the lint file type, default snippet.tsx'),
      },
    },
    async ({ code, filename }) => {
      const result = await validate(code, filename);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      };
    },
  );

  return server;
}

function utilityFor(path: string[], tier: string): string | undefined {
  const [root, ...rest] = path;
  const key = rest.join('-');
  if (root === 'color' && tier === 'semantic') return `bg-${key} | text-${key} | border-${key}`;
  if (root === 'text' && rest[0] === 'size') return `text-${rest[1]}`;
  if (root === 'shape') return `rounded-${key}`;
  if (root === 'elevation') return `shadow-${key}`;
  if (root === 'radius' && tier === 'primitive') return `rounded-${key}`;
  if (root === 'duration') return `duration-${key}`;
  if (root === 'ease') return `ease-${key}`;
  if (root === 'z') return `z-${key}`;
  if (root === 'size' && rest[0] === 'control') return `h-control-${rest[1]}`;
  return undefined;
}

const isMain =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop() ?? '\u0000');
if (isMain) {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
