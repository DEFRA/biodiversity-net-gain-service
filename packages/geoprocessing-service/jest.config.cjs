module.exports = {
  rootDir: '.',
  moduleNameMapper: {
    '@defra/bng-connectors-lib/azure-storage': '<rootDir>/../../node_modules/@defra/bng-connectors-lib/src/helpers/azure-storage.js'
  },
  setupFiles: ['<rootDir>/.jest/test.env.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  coveragePathIgnorePatterns: ['<rootDir>/src/helpers/dirname.cjs'],
  transformIgnorePatterns: [
    'node_modules/(?!(geodesy)/)'
  ]
}
