import pg from 'pg'
import { logger } from 'defra-logging-facade'

let pool

class Db {
  constructor (config) {
    this.init(config)
  }

  init (config) {
    logger.info('init')
    logger.info(pool)
    if (!pool || pool.ending) {
      pool = new pg.Pool(config)
    }
  }

  query (query, vars) {
    this.init()
    logger.info('query')
    logger.info(query, vars)
    return pool.query(query, vars)
  }

  // end must always be called after queries have been completed to ensure clean shutdown of pool and clients
  async end () {
    logger.info('end')
    logger.info(pool)
    if (pool && !pool.ending) {
      await pool.end()
    }
  }
}

export const postgresConnector = Object.freeze({
  Db
})
