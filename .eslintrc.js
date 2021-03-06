// @ts-check

/** @type { import('eslint').Linter.Config } */
const config = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 11,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'import/no-unresolved': 'off',
    'no-case-declarations': 'off',
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
          '=': 'ignore',
        },
      },
    ],
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'max-len': [
      'warn',
      {
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
      },
    ],
    'accessor-pairs': 'error',
    'array-bracket-newline': 'error',
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'array-callback-return': 'off',
    'array-element-newline': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': [
      'warn',
      'as-needed',
    ],
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true,
      },
    ],
    'block-scoped-var': 'error',
    'block-spacing': 'error',
    'brace-style': [
      'error',
      '1tbs',
    ],
    'import/prefer-default-export': 'off',
    'callback-return': 'off',
    'import/extensions': ['error', 'never'],
    camelcase: 'error',
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'comma-spacing': [
      'error',
      {
        after: true,
        before: false,
      },
    ],
    'comma-style': [
      'error',
      'last',
    ],
    complexity: [
      'error',
      24,
    ],
    'computed-property-spacing': [
      'error',
      'always',
    ],
    'consistent-return': 'off',
    'consistent-this': 'off',
    curly: 'error',
    'default-case': 'warn',
    'dot-location': [
      'error',
      'property',
    ],
    'dot-notation': [
      'error',
      {
        allowKeywords: true,
      },
    ],
    'eol-last': [
      'error',
      'always',
    ],
    eqeqeq: 'error',
    'func-call-spacing': 'error',
    'func-name-matching': 'error',
    'func-names': 'warn',
    'func-style': 'off',
    'function-paren-newline': 'off',
    'generator-star-spacing': 'error',
    'global-require': 'error',
    'guard-for-in': 'off',
    'handle-callback-err': 'error',
    'id-blacklist': 'error',
    'id-length': 'off',
    'id-match': 'error',
    'implicit-arrow-linebreak': [
      'error',
      'beside',
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'init-declarations': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'key-spacing': 'error',
    'keyword-spacing': 'off',
    'line-comment-position': 'error',
    'linebreak-style': [
      'error',
      'unix',
    ],
    'lines-around-comment': 'off',
    'lines-around-directive': 'error',
    'lines-between-class-members': [
      'error',
      'always',
    ],
    'max-classes-per-file': 'off',
    'max-depth': [
      'error',
      6,
    ],
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'max-nested-callbacks': 'error',
    'max-params': 'off',
    'max-statements': 'off',
    'max-statements-per-line': 'error',
    'multiline-comment-style': 'off',
    'new-parens': 'error',
    'newline-after-var': 'off',
    'new-cap': 'error',
    'newline-before-return': 'off',
    'newline-per-chained-call': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-buffer-constructor': 'error',
    'no-caller': 'error',
    'no-catch-shadow': 'error',
    'no-confusing-arrow': 'error',
    'no-continue': 'error',
    'no-div-regex': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    // "no-eq-null": "warn", shadowed by another rule
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': 'off',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-inline-comments': 'off',
    'no-invalid-this': 'off',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'off',
    'no-magic-numbers': 'off',
    'no-misleading-character-class': 'error',
    'no-mixed-operators': 'off',
    'no-mixed-requires': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': [
      'error',
      {
        ignoreEOLComments: true,
      },
    ],
    'no-multi-str': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
      },
    ],
    'no-native-reassign': 'error',
    'no-negated-condition': 'error',
    'no-negated-in-lhs': 'error',
    'no-nested-ternary': 'off',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-path-concat': 'error',
    'no-plusplus': 'off',
    'no-process-env': 'warn',
    'no-process-exit': 'error',
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-restricted-globals': 'error',
    'no-restricted-imports': 'error',
    'no-restricted-modules': 'error',
    'no-restricted-properties': 'error',
    'no-restricted-syntax': ['error', {
      selector: 'LabeledStatement',
      message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
    },
    {
      selector: 'WithStatement',
      message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
    }],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'no-spaced-func': 'error',
    'no-sync': 'warn',
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-ternary': 'off',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'off',
    'no-underscore-dangle': 'off',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': ['off'],
    'no-use-before-define': 'off',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'off',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'off',
    'no-warning-comments': 'warn',
    'no-whitespace-before-property': 'error',
    'no-with': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': [
      'error',
      {
        consistent: true,
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
    'object-shorthand': 'error',
    'one-var': 'off',
    'one-var-declaration-per-line': [
      'error',
      'initializations',
    ],
    'operator-assignment': 'error',
    'padded-blocks': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'any', prev: 'if', next: 'if' },
      { blankLine: 'always', prev: 'switch', next: '*' },
      { blankLine: 'always', prev: 'for', next: '*' },
    ],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'off',
    'prefer-numeric-literals': 'error',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'off',
    'prefer-reflect': 'off',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': [
      'error',
      'as-needed',
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'require-jsdoc': 'off',
    'require-unicode-regexp': 'off',
    'rest-spread-spacing': 'error',
    semi: 'error',
    'semi-spacing': 'error',
    'semi-style': [
      'error',
      'last',
    ],
    'sort-imports': 'off',
    'sort-keys': 'off',
    'sort-vars': 'off',
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': [
      'error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'no-constant-condition': [
      'error',
      { checkLoops: false },
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    strict: [
      'error',
      'global',
    ],
    'switch-colon-spacing': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': [
      'error',
      'always',
    ],
    'template-tag-spacing': 'error',
    'unicode-bom': [
      'error',
      'never',
    ],
    'valid-jsdoc': 'off',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'wrap-regex': 'error',
    'yield-star-spacing': 'error',
    yoda: 'error',
    'default-param-last': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'warn',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],

  },
};

module.exports = config;
