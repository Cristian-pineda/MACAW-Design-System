import path from 'node:path';

/** apps/docs is the working directory for `next build` and `next start`; the monorepo root is two levels up. */
export const DOCS_DIR = process.cwd();
export const REPO_ROOT = path.resolve(DOCS_DIR, '..', '..');
export const REGISTRY_DIR = path.join(REPO_ROOT, 'registry');
/** Source of the template and page blocks (packages/blocks/src/<slug>/). */
export const BLOCKS_DIR = path.join(REPO_ROOT, 'packages', 'blocks', 'src');
