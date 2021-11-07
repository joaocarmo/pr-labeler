const esModules = ['escape-string-regexp'].join('|');

module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [
          'TS7006', /* Parameter 'string' implicitly has an 'any' type. */
        ],
      },
    },
  },
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.[tj]sx?$',
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
}
