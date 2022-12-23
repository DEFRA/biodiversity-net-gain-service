describe('The database version control migrator', () => {
  it('should not initialise if misconfigured', async () => {
    const expectedError =
     'Migration 2022.12.16T14.14.02.create-bng-user.js (up) failed: Original error: POSTGRES_BNG_USER_PASSWORD or POSTGRES_BNG_CLIENT_ID must be specified to create the BNG database user'

    delete process.env.POSTGRES_BNG_USER_PASSWORD
    delete process.env.POSTGRES_BNG_CLIENT_ID
    const migrator = require('../migrator.js')
    await expect(migrator.up()).rejects.toThrow(expectedError)
  })
})
