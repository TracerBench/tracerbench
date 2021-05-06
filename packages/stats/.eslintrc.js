module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'oclif',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'prettier',
    'filenames'
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'filenames/match-regex': [
      'error',
      '^(?:[a-z0-9\\-]+)*(?:\\.(?:test|d))?$',
      true
    ],
    'filenames/match-exported': ['error', 'kebab'],
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
    ]
  },
  ignorePatterns: ['dist/', 'lib/', 'node_modules/', 'DEBUG/', 'tmp/', 'test/'],
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
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    }
  ]
};
