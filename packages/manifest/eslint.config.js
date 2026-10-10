import macaw from '@macaw-ds/eslint-config';

export default [{ ignores: ['dist/**', 'schema/**'] }, ...macaw({ system: true })];
