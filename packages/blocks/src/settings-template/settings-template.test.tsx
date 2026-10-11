import { describeBlock } from '../test-utils.tsx';
import manifest from './settings-template.block.json';
import * as module from './settings-template.tsx';

describeBlock(manifest, module, module.SettingsTemplate);
