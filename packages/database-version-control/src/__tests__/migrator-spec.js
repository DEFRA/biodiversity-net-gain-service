const fs = require('fs')
const migrator = require('../migrator.js')

describe('The database version control migrator', () => {
  // Give the connection pool time to close before the test run ends.
  // https://github.com/gajus/slonik/issues/63#issuecomment-500889445
  afterAll(() => new Promise(resolve => setTimeout(resolve, 4000)))

  it('should initialise correctly and be able to run and rollback all pending migrations programmatically', async () => {
    const migrations = fs.readdirSync('packages/database-version-control/src/migrations')
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
    await migrator.up()
    expect((await migrator.pending()).map(m => m.name)).toEqual([])
    await migrator.down({ to: 0 })
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
  }, 10000)
})
