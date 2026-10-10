import { mkdir, writeFile } from 'node:fs/promises';
import { z } from 'zod';
import { ManifestSchema } from '../src/schema.ts';

const schema = z.toJSONSchema(ManifestSchema, { target: 'draft-2020-12', io: 'input' });
const out = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://github.com/Cristian-pineda/MACAW-Design-System/packages/manifest/schema/manifest.schema.json',
  title: 'MACAW component manifest',
  description:
    'The contract every MACAW component ships with. Read by the docs playground, the registry builder, the CLI, the MCP server and CI.',
  ...schema,
};
await mkdir('schema', { recursive: true });
await writeFile('schema/manifest.schema.json', JSON.stringify(out, null, 2) + '\n');
console.log('@macaw-ds/manifest: wrote schema/manifest.schema.json');
