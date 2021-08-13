process.env.NODE_ENV = 'test'
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    './server/src/**/*.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  testMatch: ['**/*.test.js']
}
