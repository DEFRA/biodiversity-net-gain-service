const fs = require('fs')
const migrator = require('../migrator.js')

describe('The database version control migrator', () => {
  it('should initialise correctly and be able to run and rollback all pending migrations programmatically', async () => {
    const migrations = fs.readdirSync('packages/database-version-control/src/migrations')
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
    await migrator.up()
    expect((await migrator.pending()).map(m => m.name)).toEqual([])
    await migrator.down({ to: 0 })
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
  }, 10000)
  it('should initialise correctly when POSTGRES_SSL_MODE is set to require', async () => {
    process.env.POSTGRES_SSL_MODE = 'require'
    const migrations = fs.readdirSync('packages/database-version-control/src/migrations')
    expect((await migrator.pending()).map(m => m.name)).toEqual(migrations.slice(0, migrations.length - 1))
  }, 10000)
})
