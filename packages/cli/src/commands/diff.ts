import { join } from 'node:path';
import { defineCommand } from 'citty';
import { readJsonIfExists } from '../lib/fsx.ts';

export const diff = defineCommand({
  meta: {
    name: 'diff',
    description: 'Compare an ejected component with the current upstream (available in 0.2)',
  },
  args: {
    name: { type: 'positional', required: true },
    cwd: { type: 'string', default: process.cwd() },
  },
  async run({ args }) {
    const record = await readJsonIfExists<{
      ejected: Array<{ name: string; version: string; date: string }>;
    }>(join(args.cwd, '.macaw/ejected.json'));
    const entry = record?.ejected.find((e) => e.name === args.name);
    if (!entry) {
      console.log(`${args.name} is not ejected here (no entry in .macaw/ejected.json).`);
      return;
    }
    console.log(
      `${args.name} was ejected from version ${entry.version} on ${entry.date}. \`macaw diff\` ships in 0.2; until then compare against the registry item at <docs>/r/${args.name}.json.`,
    );
  },
});
