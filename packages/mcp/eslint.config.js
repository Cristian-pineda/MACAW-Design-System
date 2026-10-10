import macaw from '@macaw-ds/eslint-config';

export default [{ ignores: ['dist/**', 'registry/**'] }, ...macaw({ system: true })];
