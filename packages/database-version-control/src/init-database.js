const pg = require('pg')

// pg is being used, and not slonik, as slonik would not allow a database to be created with a paramterised name
// nor could a pre built query string be executed, due to the way slonik protects against injection etc.
const initDatabase = async () => {
  const dbName = process.env.POSTGRES_DATABASE
  const config = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres', // default database as application database may not exist yet
    port: process.env.POSTGRES_PORT,
    ssl: !!process.env.POSTGRES_SSL_MODE
  }
  const pool = new pg.Pool(config)
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
