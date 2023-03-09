const { pipeline } = require('stream')
const { createGunzip } = require('zlib')
const { promisify } = require('util')
const pipe = promisify(pipeline)
const { createReadStream, createWriteStream } = require('fs')
const path = require('path')
const { SlonikMigrator } = require('@slonik/migrator')
const { createPool, sql } = require('slonik')

const migrationsSchemaName = 'slonik_tools'
const migrationsSchemaIdentifier = sql.identifier([migrationsSchemaName])
const sslMode = process.env.POSTGRES_SSL_MODE ? `?sslmode=${process.env.POSTGRES_SSL_MODE}` : ''
const connectionString = `postgresql://${process.env.POSTGRES_USER}
:${process.env.POSTGRES_PASSWORD}
@${process.env.POSTGRES_HOST}
:${process.env.POSTGRES_PORT}
/${process.env.POSTGRES_DATABASE}
${sslMode}`

const slonik = createPool(connectionString, {
  interceptors: [
    {
      afterPoolConnection: async (_context, connection) => {
        await connection.query(sql`
          create schema if not exists ${migrationsSchemaIdentifier};
        `)
        return null
      }
    }
  ]
})

const migrator = new SlonikMigrator({
  logger: console,
  schema: migrationsSchemaName,
  migrationsPath: path.join(__dirname, '/migrations'),
  migrationTableName: [migrationsSchemaName, 'migration'],
  slonik
})

module.exports = migrator

const gunzipDataMigrations = async () => {
  const srcDirectoryPath = path.join(__dirname, '/')
  const dataMigrationsDirectoryPath = `${srcDirectoryPath}data-migrations/`
  const migrationsDirectoryPath = `${srcDirectoryPath}migrations/`
  const populateNationBoundary27700Filename = '2023.02.21T10.42.51.populate-nation-boundary-27700-table.sql'
  const populateNationBoundary27700InputFilePath = `${dataMigrationsDirectoryPath}${populateNationBoundary27700Filename}.gz`
  const populateNationBoundary27700OutputFilePath = `${migrationsDirectoryPath}${populateNationBoundary27700Filename}`

  return Promise.all([
    await gunzipDataMigration(`${populateNationBoundary27700InputFilePath}`, `${populateNationBoundary27700OutputFilePath}`)
  ])
}

const gunzipDataMigration = async (inputFilePath, outputFilePath) => {
  const gunzip = createGunzip()
  const source = createReadStream(inputFilePath)
  const destination = createWriteStream(outputFilePath)
  return pipe(source, gunzip, destination)
}

(
  async () => { await gunzipDataMigrations() }
)()
