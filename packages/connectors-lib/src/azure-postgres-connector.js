import pg from 'pg'

let pool

class Db {
  constructor (config, context) {
    this.context = context
    this.init(config)
  }

  init (config) {
    this.context?.log('init')
    this.context?.log(pool)
    if (!pool || pool.ending) {
      pool = new pg.Pool(config)
    }
  }

  query (query, vars) {
    this.init()
    this.context?.log('query')
    this.context?.log(query, vars)
    return pool.query(query, vars)
  }

  // end must always be called after queries have been completed to ensure clean shutdown of pool and clients
  async end () {
    this.context?.log('end')
    this.context?.log(pool)
    if (pool && !pool.ending) {
      await pool.end()
    }
  }
}

export const postgresConnector = Object.freeze({
  Db
})
