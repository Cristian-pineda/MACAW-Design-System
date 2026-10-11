import { describeBlock } from '../test-utils.tsx';
import manifest from './invoice-record.block.json';
import * as module from './invoice-record.tsx';

describeBlock(manifest, module, module.InvoiceRecord);
