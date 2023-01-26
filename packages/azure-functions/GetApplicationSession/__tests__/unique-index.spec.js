import getApplicationSession from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')
jest.mock('../../Shared/db-config.js')
jest.mock('@azure/identity')
const dbConfig = require('../../Shared/db-config')
dbConfig.default = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  ssl: !!process.env.POSTGRES_SSL_MODE
}

const req = {
  body: {
    email: 'test@test.com',
    applicationReference: 'REF001'
  }
}

describe('Get Application Session', () => {
  it('Should get an application if email and reference present', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.getApplicationSession = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              application_session: {}
            }]
          }
        })
        await getApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual('{}')
        expect(dbQueries.getApplicationSession.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no email', done => {
    jest.isolateModules(async () => {
      try {
        req.body.email = ''
        const dbQueries = require('../../Shared/db-queries.js')
        await getApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSession.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no reference', done => {
    jest.isolateModules(async () => {
      try {
        req.body.applicationReference = ''
        const dbQueries = require('../../Shared/db-queries.js')
        await getApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSession.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
