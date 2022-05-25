module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  setupFiles: [
    '<rootDir>/tests/setupJest.js',
  ],
  // setupFilesAfterEnv: [
  //   '<rootDir>/tests/setupTestingLibrary.js',
  // ],
  testEnvironment: 'jsdom',
  verbose: true,
};
