import { postgresConnector } from '../azure-postgres-connector.js'
jest.mock('pg')

describe('PostgresConnector', () => {
  it('should initialise', () => {
    const db = new postgresConnector.Db('testConnectionString')
    expect(typeof db.init).toEqual('function')
    expect(typeof db.query).toEqual('function')
    expect(typeof db.end).toEqual('function')
  })
  it('should query', async () => {
    const db = new postgresConnector.Db('testConnectionString')
    await db.query('test query')
  })
  it('should end', async () => {
    const db = new postgresConnector.Db('testConnectionString')
    await db.end()
  })
})
