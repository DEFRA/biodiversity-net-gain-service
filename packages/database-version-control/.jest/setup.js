const migrator = require('../src/migrator.js')
const ORIGINAL_ENV = process.env

afterEach(async () => {
  // If a unit test depends on the command line interface, programmatic migration attempts fail.
  if (!JSON.parse(process.env.POSTGRES_SKIP_MIGRATION_ROLLBACK || false)) {
    await migrator.down({to: 0})
  }
   process.env = { ...ORIGINAL_ENV }
})

// Give the connection pool time to close before the test run ends.
// https://github.com/gajus/slonik/issues/63#issuecomment-500889445
afterAll(() => new Promise(resolve => setTimeout(resolve, 4000)))
