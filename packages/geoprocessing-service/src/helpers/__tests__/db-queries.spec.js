import { isPolygonInEnglandOnly } from '../db-queries.js'

describe('Database queries', () => {
  describe('isInEnglandOnly', () => {
    it('Should be a function', () => {
      expect(typeof isPolygonInEnglandOnly).toBe('function')
    })
  })
  it('Should run db.query with correct script', () => {
    const db = {
      query: query => query
    }
    expect(isPolygonInEnglandOnly(db)).toEqual('SELECT bng.fn_is_polygon_in_england_only($1);')
  })
})
