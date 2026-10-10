import type { ComponentType } from 'react';

type MdxModule = { default: ComponentType };

/**
 * Loads `<slug>.mdx` from the component folder in packages/ui/src through the `@content/*` alias
 * (a Turbopack context import over the `<name>/<name>.mdx` files under packages/ui/src).
 * Returns null when the component has no MDX (Icon lives in packages/icons and ships none).
 */
export async function loadComponentMdx(slug: string): Promise<ComponentType | null> {
  try {
    const mod = (await import(`@content/${slug}/${slug}.mdx`)) as MdxModule;
    return mod.default ?? null;
  } catch {
    return null;
  }
}
