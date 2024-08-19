import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/.*',
      '**/node_modules/*',
      'build/*',
      'package/*',

      // Ignore files for PNPM, NPM and YARN
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',

      // Ignore config type check
      '**/*.config.js',
      '**/*.config.ts'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  }
);