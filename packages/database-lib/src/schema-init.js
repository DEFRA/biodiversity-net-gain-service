import * as fs from 'fs'
import path from 'path'

function createDatabaseConfiguration (client, configuration) {
  try {
    if (configuration.initialise === true) {
      client.connect()
      try {
        client.query(`CREATE DATABASE "${configuration.database}"`)
        const createSchemaQuery = fs.readFileSync(path.resolve(configuration.dbCreateFile), 'utf8')
        const inserteDefaultDataQuery = fs.readFileSync(path.resolve(configuration.dbInsertFile), 'utf8')
        client.query(createSchemaQuery)
        client.query(inserteDefaultDataQuery)
      } catch (error) {
        console.log(`Database ${configuration.dbCreateFile} already exist or issue with query`)
      }
    }
  } catch (error) {
    console.log('Unable to connect to database')
    return false
  }
  return true
}

export default createDatabaseConfiguration
