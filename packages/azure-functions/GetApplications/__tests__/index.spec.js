import getApplicationsByContactIdAndApplicationType from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    contactId: 'mock contact ID',
    applicationType: 'mock application type'
  }
}

describe('Get Applications', () => {
  const applications = [{
    applicationReference: 'mock application reference 1',
    lastUpdated: 'mock last updated 1',
    applicationStatus: 'mock application status 1'
  }, {
    applicationReference: 'mock application reference 2',
    lastUpdated: 'mock last updated 2',
    applicationStatus: 'mock application status 2'
  }]

  it('Should get all applications of a particular type associated with a contact ID', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.getApplicationCountByContactIdAndOrganisationId = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              contact_id: 'mock contact ID',
              application_count: applications.length
            }]
          }
        })
        dbQueries.getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              application_reference: 'mock application reference 1',
              date_modified: 'mock last updated 1',
              application_status: 'mock application status 1'
            }, {
              application_reference: 'mock application reference 2',
              date_modified: 'mock last updated 2',
              application_status: 'mock application status 2'
            }]
          }
        })
        await getApplicationsByContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual(applications)
        expect(dbQueries.getApplicationCountByContactIdAndOrganisationId.mock.calls).toHaveLength(1)
        expect(dbQueries.getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should not return no data if no applications of a particular type are associated with a contact ID', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.getApplicationCountByContactIdAndOrganisationId = jest.fn().mockImplementation(() => {
          return {
            rows: [{
              contact_id: 'mock contact ID',
              application_count: 0
            }]
          }
        })
        dbQueries.getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType = jest.fn().mockImplementation(() => {
          return {
            rows: []
          }
        })
        await getApplicationsByContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toEqual([])
        expect(dbQueries.getApplicationCountByContactIdAndOrganisationId.mock.calls).toHaveLength(1)
        expect(dbQueries.getApplicationStatusesByContactIdAndOrganisationIdAndApplicationType.mock.calls).toHaveLength(0)
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
        await getApplicationsByContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceContactIdOrganisationIdAndApplicationType.mock.calls).toHaveLength(0)
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
        await getApplicationsByContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceContactIdOrganisationIdAndApplicationType.mock.calls).toHaveLength(0)
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
        await getApplicationsByContactIdAndApplicationType(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(dbQueries.getApplicationSessionByReferenceContactIdOrganisationIdAndApplicationType.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
