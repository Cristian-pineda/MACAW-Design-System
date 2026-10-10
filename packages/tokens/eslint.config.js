import macaw from '@macaw-ds/eslint-config';

export default [{ ignores: ['dist/**'] }, ...macaw({ system: true })];
