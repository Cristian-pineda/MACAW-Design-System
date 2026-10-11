import { describeBlock } from '../test-utils.tsx';
import manifest from './record-template.block.json';
import * as module from './record-template.tsx';

describeBlock(manifest, module, module.RecordTemplate);
