/** Copies plugin/ and registry/ into templates/ so the published CLI is self-contained and pinned to this version. */
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../..', import.meta.url));
const out = fileURLToPath(new URL('../templates', import.meta.url));
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(`${root}plugin`, `${out}/plugin`, {
  recursive: true,
  filter: (p) => !p.includes('/README.md'),
});
await cp(`${root}registry`, `${out}/registry`, { recursive: true });
console.log('@macaw-ds/cli: templates/ refreshed from plugin/ and registry/');
