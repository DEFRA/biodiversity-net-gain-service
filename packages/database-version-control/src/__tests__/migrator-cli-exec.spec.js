const fs = require('fs')
const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)
const migrator = require('../migrator.js')

describe('The database version control migrator command line interface', () => {
  beforeAll(() => {
    // Create a dummy migration file for each data migration file that is gzipped.
    const dataMigrationFiles = fs.readdirSync('packages/database-version-control/src/data-migrations')
    const migrationsDirectory = 'packages/database-version-control/src/migrations'
    dataMigrationFiles.forEach(dataMigrationFile => {
      fs.writeFileSync(`${migrationsDirectory}/${dataMigrationFile.substring(0, dataMigrationFile.length - 3)}`, 'mock data')
    })
  })
  it('should initialise correctly and be able to run and rollback all pending migrations using the command line interface', async () => {
    const migrations = fs.readdirSync('packages/database-version-control/src/migrations')
    // Jest does not appear to generate test coverage for subprocesses by default.
    // https://github.com/facebook/jest/issues/3190 and https://github.com/facebook/jest/issues/5274
    // Test coverage for activating the command line interface is achieved using a very basic unit test
    // in migrator-cli.spec.js.
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
    await exec('. bin/jest-database-version-control-env.sh && node packages/database-version-control/src/migrator-cli.js up')
    await exec('. bin/jest-database-version-control-env.sh && node packages/database-version-control/src/migrator-cli.js pending')
    expect((await migrator.pending()).map(m => m.name)).toEqual([])
    await exec('. bin/jest-database-version-control-env.sh && node packages/database-version-control/src/migrator-cli.js down --to 0')
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
  }, 20000)
})
