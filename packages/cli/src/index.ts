#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { add } from './commands/add.ts';
import { diff } from './commands/diff.ts';
import { init } from './commands/init.ts';

const main = defineCommand({
  meta: { name: 'macaw', description: 'The one door into the MACAW design system' },
  subCommands: { init, add, diff },
});

runMain(main);
