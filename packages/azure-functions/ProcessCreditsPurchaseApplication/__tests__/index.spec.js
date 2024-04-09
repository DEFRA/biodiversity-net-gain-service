import processCreditsApplication from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import applicationStatuses from '../../Shared/application-statuses.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    creditsPurchase: {
      applicant: {
        name: 'Test Applicant',
        emailAddress: 'test@example.com'
      },
      submittedOn: '2023-12-04T14:58:08.279Z'
    }
  }
}

const creditReference = 'BNGCRD-TEST1-T3ST2'

describe('Processing an application', () => {
  it('should process valid application without a reference number successfully', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.createCreditsAppReference = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                fn_create_credits_app_reference: creditReference
              }
            ]
          }
        })
        // execute function
        await processCreditsApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.creditsPurchase.creditReference).toEqual(creditReference)
        expect(dbQueries.createCreditsAppReference.mock.calls).toHaveLength(1)
        expect(dbQueries.getApplicationStatus.mock.calls).toHaveLength(0)
        expect(dbQueries.deleteApplicationSession.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('should process valid application with a reference number successfully', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.getApplicationStatus = jest.fn().mockImplementation(() => {
          return {
            rows: []
          }
        })
        req.body.creditsPurchase.creditReference = creditReference
        // execute function
        await processCreditsApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.creditsPurchase.creditReference).toEqual(creditReference)
        expect(dbQueries.createCreditsAppReference.mock.calls).toHaveLength(0)
        expect(dbQueries.getApplicationStatus.mock.calls).toHaveLength(1)
        expect(dbQueries.deleteApplicationSession.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('should fail to process an application with a submitted status', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.getApplicationStatus = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                application_status: applicationStatuses.submitted
              }
            ]
          }
        })
        req.body.creditsPurchase.creditReference = creditReference
        // execute function
        await processCreditsApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(context.res.body.applicationReference).toEqual(creditReference)
        expect(context.res.body.message).toEqual('Application reference has already been processed')
        expect(context.bindings.outputSbQueue).toBeFalsy()
        expect(dbQueries.createCreditsAppReference.mock.calls).toHaveLength(0)
        expect(dbQueries.getApplicationStatus.mock.calls).toHaveLength(1)
        expect(dbQueries.deleteApplicationSession.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should return 400 response if malformed content', done => {
    jest.isolateModules(async () => {
      try {
        // execute function
        await processCreditsApplication(getContext(), 'dsjjhdsjf')

        const context = getContext()
        expect(context.res.status).toEqual(400)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
