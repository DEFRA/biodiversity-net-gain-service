const path = require('path')
const { SlonikMigrator } = require('@slonik/migrator')
const { createPool, sql } = require('slonik')

const migrationsSchemaName = 'slonik_tools'
const migrationsSchemaIdentifier = sql.identifier([migrationsSchemaName])

const sslMode = process.env.POSTGRES_SSL_MODE ? `?sslmode=${process.env.POSTGRES_SSL_MODE}` : ''
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}${sslMode}`
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
