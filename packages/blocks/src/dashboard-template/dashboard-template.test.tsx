import { describeBlock } from '../test-utils.tsx';
import manifest from './dashboard-template.block.json';
import * as module from './dashboard-template.tsx';

describeBlock(manifest, module, module.DashboardTemplate);
