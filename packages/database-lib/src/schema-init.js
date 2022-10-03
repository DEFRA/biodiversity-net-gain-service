import * as fs from 'fs'
import path from 'path'

async function createDatabaseConfiguration(client, configuration) {
  try {
    if (configuration.initialise === true) {
      client.connect()
      try {
        await client.query(`CREATE DATABASE "${configuration.database}"`)
        const createSchemaQuery = fs.readFileSync(path.resolve(configuration.dbCreateFile), 'utf8')
        const insertDefaultDataQuery = fs.readFileSync(path.resolve(configuration.dbInsertFile), 'utf8')
        await client.query(createSchemaQuery)
        await client.query(insertDefaultDataQuery)
      } catch (error) {
        console.log(`Database ${configuration.dbCreateFile} already exist or issue with query ${error}`)
      }
    }
  } catch (error) {
    console.log('Unable to connect to database')
    return false
  }
  return true
}

export default createDatabaseConfiguration
