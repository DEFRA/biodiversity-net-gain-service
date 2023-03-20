const fs = require('fs')
const migrator = require('../migrator.js')

const migrationsDirectoryPath = 'packages/database-version-control/src/migrations'

describe('The database version control migrator', () => {
  it('should initialise correctly and be able to run and rollback all pending migrations programmatically', async () => {
    const migrations = fs.readdirSync(migrationsDirectoryPath)
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
    // As prepare-data-migrations.js runs during installation and is excluded from test coverage, check that the list of migrations
    // includes expected data migrations.
    expect(migrations.includes('2023.02.21T10.42.51.populate-nation-boundary-27700-table.sql')).toBeTruthy()
    await migrator.up()
    expect((await migrator.pending()).map(m => m.name)).toEqual([])
    await migrator.down({ to: 0 })
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
  }, 30000)
  it('should initialise correctly when POSTGRES_SSL_MODE is set to require', async () => {
    jest.isolateModules(async () => {
      process.env.POSTGRES_SSL_MODE = 'require'
      const migrator = require('../migrator.js')
      expect(migrator).not.toEqual(null)
    })
  })
})
