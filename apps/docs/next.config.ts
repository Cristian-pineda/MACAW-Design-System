import path from 'node:path';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const monorepoRoot = path.resolve(process.cwd(), '..', '..');

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['@macaw-ds/ui', '@macaw-ds/icons', '@macaw-ds/tokens', '@macaw-ds/manifest'],
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

const withMDX = createMDX({
  options: {
    // Plugins are passed as strings so Turbopack can serialise the config.
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug'],
  },
});

export default withMDX(nextConfig);
