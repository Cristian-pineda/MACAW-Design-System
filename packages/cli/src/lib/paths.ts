import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** templates/ sits next to dist/ in the published package; tests may point elsewhere. */
export function templatesDir(): string {
  if (process.env.MACAW_TEMPLATES_DIR) return process.env.MACAW_TEMPLATES_DIR;
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [join(here, '..', 'templates'), join(here, '..', '..', 'templates')]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('MACAW templates not found. Reinstall @macaw-ds/cli or set MACAW_TEMPLATES_DIR.');
}

export function pluginDir(): string {
  return join(templatesDir(), 'plugin');
}

export function registryDir(): string {
  return join(templatesDir(), 'registry');
}
