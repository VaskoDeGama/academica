process.env.NODE_ENV = 'UNITTEST'
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    './server/src/**/*.ts'
  ],
  coverageDirectory: '<rootDir>server/test/coverage',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest'
}
