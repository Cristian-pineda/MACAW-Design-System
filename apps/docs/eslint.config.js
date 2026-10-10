import macaw from '@macaw-ds/eslint-config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

// eslint-config-next registers its own copies of jsx-a11y and react-hooks; the MACAW config
// registers the same plugins, and flat config forbids defining one plugin twice. Keep Next's
// rules (they resolve against the MACAW-registered instances) but drop its plugin entries.
const SHARED_PLUGINS = ['jsx-a11y', 'react-hooks'];
const next = nextCoreWebVitals.map((config) => {
  if (!config.plugins) return config;
  const plugins = { ...config.plugins };
  for (const name of SHARED_PLUGINS) delete plugins[name];
  return { ...config, plugins };
});

const config = [
  { ignores: ['.next/**', 'out/**', 'public/**', 'next-env.d.ts', 'node_modules/**'] },
  ...next,
  ...macaw({ tailwindEntry: 'app/globals.css', system: true }),
];

export default config;
