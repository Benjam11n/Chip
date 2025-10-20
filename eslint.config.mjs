import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';

const tsParserModule = await import('@typescript-eslint/parser');
const importPluginModule = await import('eslint-plugin-import');
const unusedImportsPluginModule = await import('eslint-plugin-unused-imports');
const reactRefreshPluginModule = await import('eslint-plugin-react-refresh');
const reactPluginModule = await import('eslint-plugin-react');

const tsParser = tsParserModule.default;
const importPlugin = importPluginModule.default;
const unusedImportsPlugin = unusedImportsPluginModule.default;
const reactRefreshPlugin = reactRefreshPluginModule.default;
const reactPlugin = reactPluginModule.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'next-env.d.ts'],
  },

  // Global React settings to prevent version warning
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/core-web-vitals',
  ),

  // Prettier config to disable conflicting rules
  prettierConfig,

  // Next.js plugin rules
  {
    plugins: {
      '@next/next': nextPlugin,
    },
  },

  // Accessibility rules
  jsxA11y.flatConfigs.recommended,

  // TypeScript + React config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: importPlugin,
      unusedImports: unusedImportsPlugin,
      reactRefresh: reactRefreshPlugin,
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // JavaScript
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-undef': 'off',

      // TypeScript
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      'no-template-curly-in-string': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: true,
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // Import hygiene
      'import/no-cycle': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/newline-after-import': 'error',

      // Enforce blank line after directives like 'use client'
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
      ],

      // React
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-key': 'warn',
      'react/prop-types': 'off',

      // Best practices
      'prefer-const': 'error',
      'prefer-destructuring': ['error', { object: true, array: true }],
      'no-implicit-coercion': 'error',

      // Import sorting
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object'],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@app/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
