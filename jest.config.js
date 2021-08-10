process.env.NODE_ENV = 'test'
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
