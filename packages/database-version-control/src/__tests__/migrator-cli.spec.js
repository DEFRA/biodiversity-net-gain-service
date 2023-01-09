const migratorCLI = require('../migrator-cli')
jest.mock('@azure/identity')
jest.mock('../init-database.js')
jest.mock('../migrator.js')
const initDatabase = require('../init-database.js')
const migrator = require('../migrator.js')
const { DefaultAzureCredential } = require('@azure/identity')
DefaultAzureCredential.prototype.getToken = jest.fn().mockImplementation(() => {
  return {
    token: 'abcdef'
  }
})

describe('migrator-cli tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should run the migrator without managed identity if password is set', async () => {
    await migratorCLI()
    expect(DefaultAzureCredential.prototype.getToken.mock.calls).toHaveLength(0)
    expect(initDatabase.mock.calls).toHaveLength(1)
    expect(migrator.runAsCLI.mock.calls).toHaveLength(1)
  })
  it('Should run the migrator with managed identity if password not set that sets the password as auth key', async () => {
    process.env.POSTGRES_PASSWORD = ''
    await migratorCLI()
    expect(DefaultAzureCredential.prototype.getToken.mock.calls).toHaveLength(1)
    expect(initDatabase.mock.calls).toHaveLength(1)
    expect(migrator.runAsCLI.mock.calls).toHaveLength(1)
  })
})
