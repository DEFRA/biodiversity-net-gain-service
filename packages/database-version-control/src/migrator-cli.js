const executeMigrator = async () => {
  if (!process.env.POSTGRES_PASSWORD) {
    process.env.POSTGRES_PASSWORD = await require('./managed-identity-auth').getToken()
  }
  const initDatabase = require('./init-database.js')
  const migrator = require('./migrator.js')
  await initDatabase()
  migrator.runAsCLI()
}

executeMigrator()
