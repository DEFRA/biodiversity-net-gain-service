const initDatabase = require('./init-database.js')
const migrator = require('./migrator.js')

const executeMigrator = async () => {
  await initDatabase()
  migrator.runAsCLI()
}

executeMigrator()
module.exports = migrator
