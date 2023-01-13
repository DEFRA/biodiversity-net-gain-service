import pg from 'pg'

let pool

class Db {
  constructor (config, test = false) {
    this.init(config, test)
  }

  init (config, test) {
    if (!test && (!pool || pool.ending)) {
      pool = new pg.Pool(config)
    }
  }

  query (query, vars) {
    this.init()
    return pool.query(query, vars)
  }

  // end must always be called after queries have been completed to ensure clean shutdown of pool and clients
  async end () {
    if (pool && !pool.ending) {
      await pool.end()
    }
  }
}

export const postgresConnector = Object.freeze({
  Db
})
