import pg from 'pg'
import { Sequelize } from 'sequelize'
import * as fs from 'fs'
import path from 'path'

function createDatabaseConfiguration (dbConfigurationSettings) {
  return new Promise(function (resolve, reject) {
    const pgClientConfig = {
      user: dbConfigurationSettings.user,
      password: dbConfigurationSettings.password,
      host: dbConfigurationSettings.host,
      port: dbConfigurationSettings.port,
      database: 'template1'
    }
    const pool = new pg.Pool(pgClientConfig)
    pool.connect(async function (err, client, done) {
      return processDatabaseSetup(err, client, dbConfigurationSettings, resolve, reject)
    })
  })
}

function processDatabaseSetup (err, client, dbConfigurationSettings, resolve, reject) {
  if (err === undefined) {
    return client.query(`CREATE DATABASE "${dbConfigurationSettings.database}"`, async (err, res) => {
      if (res !== undefined) {
        await createBiodiversityDb(dbConfigurationSettings)
        console.log('Database created')
      } else {
        console.log(`${err}`)
      }
      client.end()
      resolve(true)
    })
  } else {
    // eslint-disable-next-line prefer-promise-reject-errors
    reject(false)
  }
}

async function createBiodiversityDb (dbConfigurationSettings) {
  const createSchemaQuery = fs.readFileSync(path.resolve(dbConfigurationSettings.dbCreateFile), 'utf8')
  const inserteDefaultDataQuery = fs.readFileSync(path.resolve(dbConfigurationSettings.dbInsertFile), 'utf8')
  const sequelize = new Sequelize(dbConfigurationSettings.database, dbConfigurationSettings.user, dbConfigurationSettings.password, {
    host: dbConfigurationSettings.host,
    port: dbConfigurationSettings.port,
    dialect: 'postgres',
    dialectOptions: {
      multipleStatements: true
    }
  })
  return executedSqlQuery(sequelize, createSchemaQuery, inserteDefaultDataQuery)
}

async function executedSqlQuery (sequelize, createSchemaQuery, inserteDefaultDataQuery) {
  return sequelize.query(createSchemaQuery).then(response => {
    sequelize.query(inserteDefaultDataQuery).then(response => {
      console.log('Inserted default data ' + JSON.stringify(response))
      return true
    })
  })
}
export default createDatabaseConfiguration
