const pg = require('pg')
const dbConnection = process.env.POSTGRES_CONNECTION_STRING

// pg is being used, and not slonik, as slonik would not allow a database to be created with a paramterised name
// nor could a pre built query string be executed, due to the way slonik protects against injection etc.

const initDatabase = async () => {
  const connectionString = dbConnection.substring(0, dbConnection.lastIndexOf('/')) + '/postgres'
  const dbName = dbConnection.substring(dbConnection.lastIndexOf('/') + 1, dbConnection.length)
  const pool = new pg.Pool({ connectionString })
  const result = await pool.query(`select 1 from pg_database WHERE datname='${dbName}';`)
  if (result.rowCount === 0) {
    console.log(`Database ${dbName} does not yet exist, creating now...`)
    await pool.query(`CREATE DATABASE ${dbName};`)
  } else {
    console.log(`Database ${dbName} already exists, skipping creation...`)
  }
  await pool.end()
}

module.exports = initDatabase
