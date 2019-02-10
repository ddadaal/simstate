module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testMatch: [
    '<rootDir>/src/__tests__/**/*.(test|spec).(ts|tsx)',
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'enzyme.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/enzyme.js'
  ],
  collectCoverage: true,
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'text-summary',
  ],

  preset: 'ts-jest',
}
