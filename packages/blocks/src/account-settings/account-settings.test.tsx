import { describeBlock } from '../test-utils.tsx';
import manifest from './account-settings.block.json';
import * as module from './account-settings.tsx';

describeBlock(manifest, module, module.AccountSettings);
