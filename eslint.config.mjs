import { configs } from '@react-ui-org/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...configs.base.recommended,
  ...configs.react.recommended,
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        afterEach: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        jest: 'readonly',
      },
    },
    name: 'docoff/tests',
  },
]);
