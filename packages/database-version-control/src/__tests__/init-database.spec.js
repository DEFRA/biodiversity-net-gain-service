const initDatabase = require('../init-database')
jest.mock('pg')

describe('init-database', () => {
  it('should call query twice and end once if no database result', async () => {
    const pg = require('pg')

    pg.Pool.prototype.query = jest.fn().mockImplementation(() => {
      console.log('in mock')
      return {
        rowCount: 0
      }
    })

    pg.Pool.prototype.end = jest.fn().mockImplementation(() => undefined)

    await initDatabase()
    expect(pg.Pool.prototype.query.mock.calls).toHaveLength(2)
    expect(pg.Pool.prototype.end.mock.calls).toHaveLength(1)
  })
  it('should call query once and end once if no database result', async () => {
    const pg = require('pg')

    pg.Pool.prototype.query = jest.fn().mockImplementation(() => {
      console.log('in mock')
      return {
        rowCount: 1
      }
    })

    pg.Pool.prototype.end = jest.fn().mockImplementation(() => undefined)

    await initDatabase()
    expect(pg.Pool.prototype.query.mock.calls).toHaveLength(1)
    expect(pg.Pool.prototype.end.mock.calls).toHaveLength(1)
  })
})
