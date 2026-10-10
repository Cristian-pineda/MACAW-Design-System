import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  dts: false,
  sourcemap: true,
  clean: true,
  fixedExtension: false,
  external: ['citty', '@clack/prompts'],
});
