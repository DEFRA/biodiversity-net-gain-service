module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node',
    'mjs'
  ],
  moduleNameMapper: {
    '@defra/bng-connectors-lib/azure-storage': '<rootDir>/node_modules/@defra/bng-azure-storage-test-utils/node_modules/@defra/bng-connectors-lib/src/helpers/azure-storage.js'
  },
  setupFiles: ['<rootDir>/.jest/test.env.js'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.js'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(geodesy)/)'
  ]
}
