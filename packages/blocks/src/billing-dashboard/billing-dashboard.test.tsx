import { describeBlock } from '../test-utils.tsx';
import manifest from './billing-dashboard.block.json';
import * as module from './billing-dashboard.tsx';

describeBlock(manifest, module, module.BillingDashboard);
