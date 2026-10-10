import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, '../../packages/ui/src'),
      '@': __dirname,
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.{ts,tsx}'],
    css: false,
  },
});
