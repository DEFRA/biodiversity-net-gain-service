module.exports = {
  coveragePathIgnorePatterns: ['__tests__/helpers'],
  moduleNameMapper: {
    '@defra/bng-connectors-lib/azure-storage': '<rootDir>/../../node_modules/@defra/bng-connectors-lib/src/helpers/azure-storage.js',
    '@defra/bng-utils-lib': '<rootDir>/../../node_modules/@defra/bng-utils-lib/src/utils.js'
  },
  setupFiles: ['<rootDir>/.jest/test.env.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  testPathIgnorePatterns: ['__tests__/helpers', 'json'],
  transformIgnorePatterns: [
    'node_modules/@defra/(?!(ngr-to-bng)/)'
  ],
  moduleDirectories: [
    'node_modules'
  ]
}
