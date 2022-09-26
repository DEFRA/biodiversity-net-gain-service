import pg from 'pg'
import * as fs from 'fs'
import path from 'path'

function createDatabaseConfiguration (dbConfigurationSettings) {
  return new Promise(function (resolve, reject) {
    const pgClientConfig = {
      user: dbConfigurationSettings.user,
      password: dbConfigurationSettings.password,
      host: 'localhost',
      port: dbConfigurationSettings.port,
      database: 'template1'
    }
    const pool = new pg.Pool(pgClientConfig)
    try {
      pool.connect(async function (err, client, done) {
        return await processDatabaseSetup(err, client, dbConfigurationSettings, resolve, reject)
      })
    } catch (e) {
      console.log(e)
    }
  })
}

async function processDatabaseSetup (err, client, dbConfigurationSettings, resolve, reject) {
  if (err === undefined) {
    return await client.query(`CREATE DATABASE "${dbConfigurationSettings.database}"`, async (dbErr, dbRes) => {
      if (dbRes !== undefined) {
        const createSchemaQuery = fs.readFileSync(path.resolve(dbConfigurationSettings.dbCreateFile), 'utf8')
        const inserteDefaultDataQuery = fs.readFileSync(path.resolve(dbConfigurationSettings.dbInsertFile), 'utf8')
        return await client.query(createSchemaQuery, async (createErr, createResult) => {
          return await client.query(inserteDefaultDataQuery, (insertErr, insertResult) => {
            console.log('Database created')
            client.end()
            resolve(true)
          })
        })
      } else {
        console.log(`${err}`)
        client.end()
        resolve(true)
      }
    })
  } else {
    // eslint-disable-next-line prefer-promise-reject-errors
    reject(false)
  }
}
export default createDatabaseConfiguration
