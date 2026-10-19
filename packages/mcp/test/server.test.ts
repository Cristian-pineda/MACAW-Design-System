import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { createServer } from '../src/server.ts';

process.env.MACAW_REGISTRY_DIR = new URL('../../../registry', import.meta.url).pathname.replace(
  /%20/g,
  ' ',
);

let client: Client;
beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  await server.connect(serverTransport);
  client = new Client({ name: 'test', version: '0.0.0' });
  await client.connect(clientTransport);
});

const text = (r: Awaited<ReturnType<Client['callTool']>>) =>
  JSON.parse((r.content as Array<{ text: string }>)[0]!.text);

describe('macaw mcp', () => {
  it('lists the four tools', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      'get_component',
      'get_tokens',
      'list_components',
      'validate',
    ]);
  });
  it('list_components returns the v1 set', async () => {
    const r = text(await client.callTool({ name: 'list_components', arguments: {} }));
    expect(r.components.map((c: { name: string }) => c.name).sort()).toEqual([
      'app-shell',
      'badge',
      'button',
      'card',
      'icon',
      'input',
      'page-header',
      'side-nav',
      'tab-nav',
      'text',
      'top-bar',
    ]);
  });
  it('get_component returns a manifest and not-in-system for unknown names', async () => {
    const r = text(await client.callTool({ name: 'get_component', arguments: { name: 'button' } }));
    expect(r.props.variant.values).toContain('destructive');
    const miss = await client.callTool({
      name: 'get_component',
      arguments: { name: 'data-table' },
    });
    expect(miss.isError).toBe(true);
    expect(text(miss).notInSystem).toBe('data-table');
  });
  it('get_component rejects names that are not plain slugs without touching the filesystem', async () => {
    for (const name of ['../../package', 'button/../text', 'Button Primary!', '.', '']) {
      const r = await client.callTool({ name: 'get_component', arguments: { name } });
      expect(r.isError).toBe(true);
      const body = text(r);
      expect(body.notInSystem).toBe(name);
      expect(body.available).toContain('button');
    }
    const ok = text(
      await client.callTool({ name: 'get_component', arguments: { name: ' Page Header ' } }),
    );
    expect(ok.slug).toBe('page-header');
  });
  it('get_tokens defaults to the semantic tier when called without filters', async () => {
    const r = text(await client.callTool({ name: 'get_tokens', arguments: {} }));
    expect(r.tier).toBe('semantic');
    expect(r.count).toBeGreaterThan(0);
    expect(r.tokens.every((t: { tier: string }) => t.tier === 'semantic')).toBe(true);
    const prim = text(
      await client.callTool({ name: 'get_tokens', arguments: { tier: 'primitive' } }),
    );
    expect(prim.tier).toBe('primitive');
    expect(prim.tokens.every((t: { tier: string }) => t.tier === 'primitive')).toBe(true);
    const grouped = text(
      await client.callTool({ name: 'get_tokens', arguments: { group: 'color' } }),
    );
    expect(grouped.tier).toBe('all');
    expect(new Set(grouped.tokens.map((t: { tier: string }) => t.tier)).size).toBeGreaterThan(1);
  });
  it('get_tokens filters by group and reports utilities and both themes', async () => {
    const r = text(
      await client.callTool({
        name: 'get_tokens',
        arguments: { group: 'color.action', tier: 'semantic' },
      }),
    );
    const primary = r.tokens.find((t: { name: string }) => t.name === 'color.action.primary');
    expect(primary.utility).toContain('bg-action-primary');
    expect(primary.light).toBeDefined();
    expect(primary.dark).toBeDefined();
  });
  it('validate flags raw values, className on MACAW components and missing components', async () => {
    const code = `import { Button } from '@macaw-ds/ui';
export function X() { return <div className="bg-[#fff]"><Button className="x">Go</Button><DataTable /></div>; }`;
    const r = await client.callTool({ name: 'validate', arguments: { code } });
    const v = text(r);
    expect(r.isError).toBe(true);
    expect(v.ok).toBe(false);
    expect(v.messages.map((m: { rule: string }) => m.rule)).toEqual(
      expect.arrayContaining(['macaw/no-raw-values', 'macaw/no-classname-on-macaw']),
    );
    expect(v.notInSystem).toEqual(['DataTable']);
    expect(v.macawComponents).toEqual(['Button']);
  });
  it('validate passes a correct snippet', async () => {
    const code = `import { Button, Text } from '@macaw-ds/ui';
export function X() { return <div className="flex gap-2 p-4"><Text numeric>$1.00</Text><Button>Pay</Button></div>; }`;
    const v = text(await client.callTool({ name: 'validate', arguments: { code } }));
    expect(v.messages.filter((m: { severity: string }) => m.severity === 'error')).toEqual([]);
    expect(v.ok).toBe(true);
  });
  it('lists templates and pages and returns a block with its source', async () => {
    const r = text(await client.callTool({ name: 'list_components', arguments: {} }));
    expect(r.levels).toEqual(['atom', 'molecule', 'organism', 'template', 'page']);
    expect(r.components.every((c: { level?: string }) => typeof c.level === 'string')).toBe(true);
    if (r.blocks.length === 0) return;
    const first = r.blocks[0];
    expect(first.install).toBe(`npx @macaw-ds/cli add ${first.name}`);
    const b = text(
      await client.callTool({ name: 'get_component', arguments: { name: first.name } }),
    );
    expect(b.kind).toBe('block');
    expect(b.source).toContain("from '@macaw-ds/ui'");
  });
});
