/* eslint-disable no-undef */
/* eslint-disable filenames/match-regex */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import', 'prettier', 'filenames'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'sort-imports': 'off',
    'import/order': 'off',
    'import/no-extraneous-dependencies': 'error',
    'import/no-unassigned-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false
      }
    ],
    '@typescript-eslint/interface-name-prefix': ['off'],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    '@typescript-eslint/no-explicit-any': ['off']
  },
  ignorePatterns: [
    'lib/',
    'node_modules/',
    'DEBUG/',
    'tmp/',
    'test/',
    'scripts/',
    'dist/'
  ],
  overrides: [
    {
      files: ['srs/**/*.ts'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking']
    },
    {
      files: ['test/**/*.ts'],
      parserOptions: {
        project: './test/tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking']
    }
  ]
};
