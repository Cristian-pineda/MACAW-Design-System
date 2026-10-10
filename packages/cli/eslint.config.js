import macaw from '@macaw-ds/eslint-config';

export default [{ ignores: ['dist/**', 'templates/**'] }, ...macaw({ system: true })];
