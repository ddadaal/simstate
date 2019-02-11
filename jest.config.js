module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.(test|spec).(ts|tsx)',
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'enzyme.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/enzyme.js'
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'text-summary',
  ],

  preset: 'ts-jest',
}
