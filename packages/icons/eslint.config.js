import macaw from '@macaw-ds/eslint-config';

export default [{ ignores: ['dist/**', 'src/generated/**'] }, ...macaw({ system: true })];
