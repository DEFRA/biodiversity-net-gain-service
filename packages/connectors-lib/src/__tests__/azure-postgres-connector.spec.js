import { postgresConnector } from '../azure-postgres-connector.js'
jest.mock('pg')

describe('PostgresConnector', () => {
  it('should initialise', () => {
    const db = new postgresConnector.Db('testConnectionString')
  })
  it('should query', () => {
    const pg = require('pg')
    const db = new postgresConnector.Db('testConnectionString')
    db.query('test query')
  })
  it('should end', async () => {
    const pg = require('pg')
    const db = new postgresConnector.Db('testConnectionString')
    await db.end()
  })
})
