import isPointInEngland from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

describe('is Point In England', () => {
  it('Should get isPointInEngland response if point is valid', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.isPointInEngland = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              fn_is_point_in_england_27700: true
            }]
          }
        })
        await isPointInEngland(getContext(), {
          body: {
            point: {
              easting: 1000,
              northing: 1000
            }
          }
        })
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual({ isPointInEngland: true })
        expect(dbQueries.isPointInEngland.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no point', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        await isPointInEngland(getContext(), { body: {} })
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.isPointInEngland.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no easting', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        await isPointInEngland(getContext(), {
          body: {
            point: {
              northing: 1000
            }
          }
        })
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.isPointInEngland.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no northing', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        await isPointInEngland(getContext(), {
          body: {
            point: {
              easting: 1000
            }
          }
        })
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.isPointInEngland.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
