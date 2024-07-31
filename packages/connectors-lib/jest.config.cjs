module.exports = {
  moduleNameMapper: {
    '@defra/bng-connectors-lib/azure-storage': '<rootDir>/../../packages/bng-connectors-lib/src/helpers/azure-storage.js'
  },
  setupFiles: ['<rootDir>/.jest/test.env.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  coveragePathIgnorePatterns: ['<rootDir>/src/azure-service-bus-connector.js']
}
