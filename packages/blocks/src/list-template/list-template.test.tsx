import { describeBlock } from '../test-utils.tsx';
import manifest from './list-template.block.json';
import * as module from './list-template.tsx';

describeBlock(manifest, module, module.ListTemplate);
