describe('The database version control migrator', () => {
  it('should initialise correctly in preparation for authentication using Microsoft Azure managed identity', async () => {
    delete process.env.POSTGRES_BNG_USER_PASSWORD
    const migrator = require('../migrator.js')
    await migrator.up()
    expect((await migrator.pending()).map(m => m.name)).toEqual([])
  }, 20000)
})
