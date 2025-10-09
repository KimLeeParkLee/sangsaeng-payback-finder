import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

// ESLint 9 Flat Config
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier: prettierPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': 'warn',
    },
  },
  // Disable formatting-conflicting rules
  prettierConfig,
];


//import js from '@eslint/js'
//     2     -import globals from 'globals'
//     3     -import reactHooks from 'eslint-plugin-react-hooks'
//     4     -import reactRefresh from 'eslint-plugin-react-refresh'
//     5     -import tseslint from 'typescript-eslint'
//     6     -import { defineConfig, globalIgnores } from 'eslint/config'
//     7     -
//     8     -export default defineConfig([
//     9     -  globalIgnores(['dist']),
//     10    -  {
//     11    -    files: ['**/*.{ts,tsx}'],
//     12    -    extends: [
//     13    -      js.configs.recommended,
//     14    -      tseslint.configs.recommended,
//     15    -      reactHooks.configs['recommended-latest'],
//     16    -      reactRefresh.configs.vite,
//     17    -    ],
//     20    -      globals: globals.browser,
//     21    -    },
//     22    -  },
//     23    -])