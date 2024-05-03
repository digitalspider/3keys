const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  js.configs.all,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: 2,
      indent: [2, 2, { SwitchCase: 1 }],
      'comma-dangle': [2, 'always-multiline'],
      'no-extra-semi': 2,
      'no-else-return': 2,
      'space-unary-ops': 2,
      'comma-spacing': [2, { before: false, after: true }],
      'no-multi-spaces': 2,
      'no-multiple-empty-lines': [2, { max: 1 }],
      'no-trailing-spaces': 2,
      'array-bracket-spacing': [2, 'never'],
      'brace-style': [2, '1tbs'],
      'block-spacing': 2,
      'max-len': [
        2,
        {
          code: 120,
          tabWidth: 2,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      'linebreak-style': [2, require('os').EOL === '\r\n' ? 'windows' : 'unix'], // eslint-disable-line
      'no-mixed-spaces-and-tabs': 2,
      'no-prototype-builtins': 2,
      /*
       * 'import/no-named-as-default-member': 2,
       * 'import/no-unresolved': 2,
       * 'import/no-duplicates': 2,
       * --- warnings ---
       */
      'no-unused-vars': 1,
      'prettier/prettier': [
        'error',
        {
          semi: true,
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          endOfLine: 'auto',
        },
      ],
    },
  },
];
