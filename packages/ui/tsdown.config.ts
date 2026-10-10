import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/button/index.ts',
    'src/text/index.ts',
    'src/input/index.ts',
    'src/badge/index.ts',
    'src/card/index.ts',
  ],
  format: ['esm'],
  platform: 'browser',
  target: 'es2022',
  // One output file per source file: per-file "use client" directives survive (scripts/check-dist.mjs verifies).
  unbundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^@macaw-ds\//,
    /^radix-ui/,
    'class-variance-authority',
  ],
});
