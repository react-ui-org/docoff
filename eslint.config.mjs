import { configs } from '@react-ui-org/eslint-config';
import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';

export default defineConfig([
  // Only these paths are linted, so `eslint` can be run without a path
  globalIgnores(
    ['*', '!src/', '!tests/', '!scripts/', '!webpack/', '!*.config.{js,mjs}'],
    'app/lint-scope',
  ),
  ...configs.base.recommended,
  ...configs.react.recommended,
  {
    files: [
      '*.config.{js,mjs}',
      'scripts/**/*',
      'webpack/**/*',
    ],
    name: 'docoff/tooling',
    rules: {
      // Node ESM requires explicit file extensions
      'import-x/extensions': 'off',
      // Tooling runs only during development and build, so it imports development dependencies
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
      // Command line tools report to the terminal
      'no-console': 'off',
    },
  },
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
