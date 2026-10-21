import uiPackage from '@macaw-ds/ui/package.json';

export const SITE_NAME = 'MACAW';
export const GITHUB_URL = 'https://github.com/Cristian-pineda/MACAW-Design-System';
export const LICENSE_NAME = 'Apache-2.0';
export const CONTRIBUTING_URL = `${GITHUB_URL}/blob/main/CONTRIBUTING.md`;
/** The published @macaw-ds/ui version; Changesets bumps it, so the site never goes stale. */
export const VERSION = uiPackage.version;
/** Semver 0.x means the public API can still change between minors. */
export const IS_PRERELEASE = VERSION.startsWith('0.');
export const REGISTRY_BASE_URL = (
  process.env.REGISTRY_BASE_URL ?? 'https://macaw-design-system.vercel.app'
).replace(/\/$/, '');
export const MARKETPLACE_ADD = 'claude plugin marketplace add Cristian-pineda/MACAW-Design-System';
export const DEFINITION_OF_DONE =
  'A new team installs @macaw-ds/ui, builds a working screen in a day without talking to us, and upgrades six months later without rewriting that screen.';
