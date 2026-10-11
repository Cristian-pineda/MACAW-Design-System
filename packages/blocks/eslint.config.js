import macaw from '@macaw-ds/eslint-config';

// Blocks are consumer-shaped code: lint them with the consumer rules (no className on MACAW components).
export default [...macaw({ tailwindEntry: 'src/styles.css' })];
