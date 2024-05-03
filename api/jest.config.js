/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
process.env = Object.assign(process.env, {
  AWSENV: 'test',
});

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    'node_modules/serialize-error/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!serialize-error/.*)'],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "**/__tests__/**/*.mjs?(x)",
    "**/?(*.)+(spec|test).mjs?(x)"
  ],
  moduleFileExtensions: [
    "mjs",
    "js"
  ]
};