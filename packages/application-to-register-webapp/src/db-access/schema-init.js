import pg from 'pg'
import { Sequelize } from 'sequelize'
import * as fs from 'fs'
import path from 'path'

function createDatabaseConfiguration (host, port, database, userName, password) {
  return new Promise(function (resolve, reject) {
    const pgClientConfig = {
      user: userName,
      password: password,
      host: host,
      port: port,
      database: 'template1'
    }
    const pool = new pg.Pool(pgClientConfig)
    pool.connect(async function (err, client, done) {
      if (err === undefined) {
        return client.query('CREATE DATABASE "Biodiversity_MVP"', async (err, res) => {
          if (res !== undefined) {
            createBiodiversityDb(host, port, database, userName, password)
            console.log('Database created')
          } else {
            console.log(`${err}`)
          }
          client.end()
          resolve(true)
        })
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(err)
      }
    })
  })
}

function createBiodiversityDb (host, port, database, userName, password) {
  const createSchemaQuery = fs.readFileSync(path.join(__dirname, 'dbscripts/bng_MVP_v_0.1_postgres.sql'), 'utf8')
  const inserteDefaultDataQuery = fs.readFileSync(path.join(__dirname, 'dbscripts/BNG_MVP_Postgres_Insert_V01.sql'), 'utf8')
  const sequelize = new Sequelize(database, userName, password, {
    host,
    port,
    dialect: 'postgres',
    dialectOptions: {
      multipleStatements: true
    }
  })
  executedSqlQuery(sequelize, createSchemaQuery, inserteDefaultDataQuery)
}

function executedSqlQuery(sequelize, createSchemaQuery, inserteDefaultDataQuery) {
  sequelize.query(createSchemaQuery).then(response => {
    sequelize.query(inserteDefaultDataQuery).then(response => {
      console.log('Inserted default data ' + JSON.stringify(response))
      return true
    })
  })
}
export default createDatabaseConfiguration
