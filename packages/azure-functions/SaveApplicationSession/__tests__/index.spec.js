import saveApplicationSession from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    'email-value': 'test@test.com',
    'application-reference': ''
  }
}

describe('Save Application Session', () => {
  it('Should Save a valid request\'s session with email, and generate a reference', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.createApplicationReference = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                fn_create_application_reference: 'REF0601220001'
              }
            ]
          }
        })
        dbQueries.saveApplicationSession = jest.fn().mockImplementation(() => {
          return {}
        })
        await saveApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual('"REF0601220001"')
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(1)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should save a valid session with email and reference', done => {
    jest.isolateModules(async () => {
      try {
        req.body['application-reference'] = 'REF001'
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.saveApplicationSession = jest.fn().mockImplementation(() => {
          return {}
        })
        await saveApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual('"REF001"')
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail to save a request if email is missing, and do no db queries', done => {
    jest.isolateModules(async () => {
      try {
        req.body['email-value'] = ''
        const dbQueries = require('../../Shared/db-queries.js')
        await saveApplicationSession(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
        expect(dbQueries.saveApplicationSession.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
