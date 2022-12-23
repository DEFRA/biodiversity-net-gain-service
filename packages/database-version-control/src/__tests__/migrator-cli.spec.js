const migrator = require('../migrator-cli.js')

describe('The database version control migrator', () => {
  it('should provide a command line interface', async () => {
    // Jest does not appear to generate test coverage for subprocesses by default.
    // https://github.com/facebook/jest/issues/3190 and https://github.com/facebook/jest/issues/5274
    // This is a very basic test used to achieve test coverage for activating the command line interface..
    // Unit tests for the command line interface are defined in migrator-cli-exec.spec.js.
    process.env.POSTGRES_SKIP_MIGRATION_ROLLBACK = 'true'
    expect(migrator).toBeDefined()
  })
})
