/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
process.env = Object.assign(process.env, {
  AWSENV: 'test',
});

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transformIgnorePatterns: ['node_modules/(?!serialize-error/.*)'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/__tests__/**/*.mjs?(x)',
    'src/?(*.)+(spec|test).[jt]s?(x)',
    'src/?(*.)+(spec|test).mjs?(x)',
  ],
  moduleFileExtensions: ['mjs', 'js'],
};
