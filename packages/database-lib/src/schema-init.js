import * as fs from 'fs'
import path from 'path'

function createDatabaseConfiguration (client, configuration) {
  try {
    if (configuration.initialise === true) {
      client.connect()
      try {
        client.query(`CREATE DATABASE "${configuration.database}"`)
        console.log('1')
        const createSchemaQuery = fs.readFileSync(path.resolve(configuration.dbCreateFile), 'utf8')
        console.log('2')
        const insertDefaultDataQuery = fs.readFileSync(path.resolve(configuration.dbInsertFile), 'utf8')
        console.log('3')
        client.query(createSchemaQuery)
        console.log('4')
        client.query(insertDefaultDataQuery)
        console.log('5')
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
