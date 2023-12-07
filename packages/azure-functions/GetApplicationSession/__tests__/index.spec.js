import getApplicationSessionByReferenceContactIdAndApplicationType from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    applicationReference: 'mock application reference',
    contactId: 'mock contact ID',
    applicationType: 'mock application type'
  }
}

describe('Get Application Session', () => {
  it('Should get an application if contact ID application type and reference present', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.getApplicationSessionByReferenceContactIdAndApplicationType = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              application_session: {}
            }]
          }
        })
        await getApplicationSessionByReferenceContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual('{}')
        expect(dbQueries.getApplicationSessionByReferenceContactIdAndApplicationType.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no contact ID', done => {
    jest.isolateModules(async () => {
      try {
        req.body.contactId = ''
        const dbQueries = require('../../Shared/db-queries.js')
        await getApplicationSessionByReferenceContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceContactIdAndApplicationType.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should fail if no application type', done => {
    jest.isolateModules(async () => {
      try {
        req.body.applicationType = ''
        const dbQueries = require('../../Shared/db-queries.js')
        await getApplicationSessionByReferenceContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceContactIdAndApplicationType.mock.calls).toHaveLength(0)
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
        await getApplicationSessionByReferenceContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceContactIdAndApplicationType.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
