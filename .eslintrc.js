module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    project: ['./tsconfig.json'],
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  plugins: ['vue', '@typescript-eslint'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.tsx']
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  },
  rules: {
    // 解决 prettier 行尾报错
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // 配置 console 与 debugger
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['info', 'warn', 'error'] }]
        : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    'no-plusplus': 'off',
    'no-restricted-exports': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-consecutive-blank-lines': 'off',
    '@typescript-eslint/object-literals-key-quotes': 'off',
    '@typescript-eslint/ordered-imports': 'off'
  }
};
