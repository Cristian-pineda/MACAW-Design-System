import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/node.ts'],
  format: ['esm'],
  platform: 'neutral',
  target: 'node24',
  dts: true,
  sourcemap: true,
  clean: true,
  fixedExtension: false,
});
