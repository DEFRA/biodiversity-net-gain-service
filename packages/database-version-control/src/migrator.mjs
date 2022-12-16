import { fileURLToPath } from 'url'
import path from 'path'
import { SlonikMigrator } from '@slonik/migrator'
import { createPool, sql } from 'slonik'

const migrationsSchemaName = 'slonik_tools'
const migrationsSchemaIdentifier = sql.identifier([migrationsSchemaName])
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const slonik = createPool(process.env.POSTGRES_CONNECTION_STRING, {
  interceptors: [
    {
      afterPoolConnection: async (context, connection) => {
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
  migrationsPath: __dirname + '/migrations',
  migrationTableName: [migrationsSchemaName, 'migration'],
  slonik
})

export default migrator
