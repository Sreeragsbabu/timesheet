module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/services/**/*.js',
    'src/routes/**/*.js',
    '!**/node_modules/**'
  ],
  rootDir: './',
  moduleDirectories: ['node_modules', 'src']
};