import getApplicationSessionByReferenceAndEmail from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

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
        dbQueries.getApplicationSessionByReferenceAndEmail = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              application_session: {}
            }]
          }
        })
        await getApplicationSessionByReferenceAndEmail(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual('{}')
        expect(dbQueries.getApplicationSessionByReferenceAndEmail.mock.calls).toHaveLength(1)
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
        await getApplicationSessionByReferenceAndEmail(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceAndEmail.mock.calls).toHaveLength(0)
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
        await getApplicationSessionByReferenceAndEmail(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceAndEmail.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
