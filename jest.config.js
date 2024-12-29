const esmModules = ['escape-string-regexp'].join('|')

module.exports = {
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.[tj]sx?$',
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(?:.pnpm/)?(${esmModules}))`,
  ],
}
