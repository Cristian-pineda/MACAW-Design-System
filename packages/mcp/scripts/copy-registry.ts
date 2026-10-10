/** Copies registry/ into the package so the published server is self-contained and pinned to this version. */
import { cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../..', import.meta.url));
const out = fileURLToPath(new URL('../registry', import.meta.url));
await rm(out, { recursive: true, force: true });
await cp(`${root}registry`, out, { recursive: true });
console.log('@macaw-ds/mcp: registry/ refreshed');
