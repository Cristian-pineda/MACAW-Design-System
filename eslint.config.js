// Root ESLint config: applies the MACAW rules to the system itself.
import macaw from '@macaw-ds/eslint-config';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      'registry/**',
      'packages/cli/templates/**',
      'packages/mcp/registry/**',
      'apps/docs/public/r/**',
      'e2e/__screenshots__/**',
      'packages/**',
      'apps/**',
      'plugin/**',
    ],
  },
  // Packages lint themselves (turbo run lint); the root config covers tooling/ and e2e/.
  ...macaw({ system: true }),
];
