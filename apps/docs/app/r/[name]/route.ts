import { getRegistryItemNames, readRegistryItemJson } from '@/lib/registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getRegistryItemNames(), 'registry'].map((name) => ({ name }));
}

/** Serves registry/r/<name>.json (and registry.json as /r/registry). public/r/*.json is the static copy with the .json suffix. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const body = await readRegistryItemJson(name);
  return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
