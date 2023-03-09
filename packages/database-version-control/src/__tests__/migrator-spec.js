const fs = require('fs')
const migrator = require('../migrator.js')

const dataMigrationsDirectoryPath = 'packages/database-version-control/src/data-migrations'

describe('The database version control migrator', () => {
  beforeAll(() => {
    // Create a dummy migration file for each data migration file that is gzipped.
    const dataMigrationFiles = fs.readdirSync(dataMigrationsDirectoryPath)
    const migrationsDirectory = 'packages/database-version-control/src/migrations'
    dataMigrationFiles.forEach(dataMigrationFile => {
      fs.writeFileSync(`${migrationsDirectory}/${dataMigrationFile.substring(0, dataMigrationFile.length - 3)}`, 'mock data')
    })
  })
  it('should initialise correctly and be able to run and rollback all pending migrations programmatically', async () => {
    const migrations = fs.readdirSync(dataMigrationsDirectoryPath)
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
    await migrator.up()
    expect((await migrator.pending()).map(m => m.name)).toEqual([])
    await migrator.down({ to: 0 })
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
  }, 20000)
  it('should initialise correctly when POSTGRES_SSL_MODE is set to require', async () => {
    jest.isolateModules(async () => {
      process.env.POSTGRES_SSL_MODE = 'require'
      const migrator = require('../migrator.js')
      expect(migrator).not.toEqual(null)
    })
  })
})
