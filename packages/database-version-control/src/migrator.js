const fs = require('fs')
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
  // Provide an option to disable data migrations during unit tests.
  const migrationsDirectoryPath =
    process.env.NODE_ENV === 'test' && process.env.DISABLE_DATA_MIGRATIONS === '1'
      ? dataMigrationsDirectoryPath
      : `${srcDirectoryPath}migrations/`

  // Ensure that non-gzipped files in the data-migrations directory are ignored.
  const dataMigrationFiles = fs.readdirSync(dataMigrationsDirectoryPath).filter(f => f.endsWith('.gz'))
  const promises = []
  dataMigrationFiles.forEach(dataMigrationFile => {
    const inputFilePath = `${dataMigrationsDirectoryPath}${dataMigrationFile}`
    const outputFilePath = `${migrationsDirectoryPath}${dataMigrationFile.substring(0, dataMigrationFile.length - 3)}`
    promises.push(gunzipDataMigration(`${inputFilePath}`, `${outputFilePath}`))
  })
  return Promise.all(promises)
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
