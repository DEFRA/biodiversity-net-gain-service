import pg from 'pg'

let pool

class Db {
  constructor (config, context) {
    this.config = config
    this.context = context
    this.init()
  }

  init () {
    this.context?.log('################# POOL INIT #################')
    this.context?.log(pool)
    if (!pool || pool.ending) {
      pool = new pg.Pool(this.config)
    }
  }

  query (query, vars) {
    this.init()
    this.context?.log('################# POOL QUERY #################')
    return pool.query(query, vars)
  }

  // end must always be called after queries have been completed to ensure clean shutdown of pool and clients
  async end () {
    this.context?.log('################# POOL END #################')
    this.context?.log(pool)
    if (pool && !pool.ending) {
      await pool.end()
    }
  }
}

export const postgresConnector = Object.freeze({
  Db
})
