import processDeveloperApplication from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import applicationStatuses from '../../Shared/application-statuses.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    developerRegistration: {
      applicant: {
        id: '1234567890',
        role: 'individual'
      },
      isLandownerLeaseholder: 'yes',
      gainSite: {
        reference: 'AZ12208461',
        offsiteUnitChange: {
          habitat: 0,
          hedge: 0,
          watercourse: 0
        }
      },
      habitats: {
        allocated: [
          {
            habitatId: '1234ABC',
            area: 0.9,
            module: 'Created',
            state: 'Habitat',
            measurementUnits: 'hectares'
          },
          {
            habitatId: '5678ABC',
            area: 0.1,
            module: 'Created',
            state: 'Habitat',
            measurementUnits: 'hectares'
          },
          {
            habitatId: '9876DEF',
            area: 0.3,
            module: 'Created',
            state: 'Hedge',
            measurementUnits: 'kilometres'
          },
          {
            habitatId: '9876FGH',
            area: 0.3,
            module: 'Created',
            state: 'Watercourse',
            measurementUnits: 'kilometres'
          },
          {
            habitatId: '1234DEF',
            area: 1,
            module: 'Enhanced',
            state: 'Habitat',
            measurementUnits: 'hectares'
          },
          {
            habitatId: '5678DEF',
            area: 0.5,
            module: 'Enhanced',
            state: 'Habitat',
            measurementUnits: 'hectares'
          },
          {
            habitatId: '9876ABC',
            area: 1,
            module: 'Enhanced',
            state: 'Habitat',
            measurementUnits: 'hectares'
          },
          {
            habitatId: '9876KLM',
            area: 0.3,
            module: 'Enhanced',
            state: 'Hedge',
            measurementUnits: 'kilometres'
          },
          {
            habitatId: '4321ABC',
            area: 0.3,
            module: 'Enhanced',
            state: 'Watercourse',
            measurementUnits: 'kilometres'
          }
        ]
      },
      files: [
        {
          contentMediaType: 'developer-upload-metric',
          fileType: 'developer-upload-metric',
          fileSize: 5131037,
          fileLocation: 'mock/developer-upload-metric/Sample Metric File.xlsm',
          fileName: 'Sample Metric File.xlsm',
          optional: false
        },
        {
          contentMediaType: 'developer-planning-decision-notice-file-type',
          fileType: 'developer-planning-decision-notice',
          fileSize: 123456,
          fileLocation: 'mock/developer-planning-notice/ABC.pdf',
          fileName: 'ABC.pdf',
          optional: false
        }
      ],
      development: {
        localPlanningAuthority: {
          code: '',
          name: 'Secretary of State'
        },
        planningReference: '12345',
        name: 'houses'
      },
      payment: {
        reference: 'TEST-1234',
        method: 'BACS'
      },
      submittedOn: '2024-05-23T21:30:51.226Z'
    }
  }
}

const allocationReference = 'BNGREG-JDSJ3-A4LI9'

describe('Processing an application', () => {
  it('should process valid application without a reference number successfully', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.createApplicationReference = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                application_reference: allocationReference
              }
            ]
          }
        })
        // execute function
        await processDeveloperApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.developerRegistration.allocationReference).toEqual(allocationReference)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(1)
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
        req.body.developerRegistration.allocationReference = allocationReference
        // execute function
        await processDeveloperApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.developerRegistration.allocationReference).toEqual(allocationReference)
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
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
        req.body.developerRegistration.allocationReference = allocationReference
        // execute function
        await processDeveloperApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(context.res.body.applicationReference).toEqual(allocationReference)
        expect(context.res.body.message).toEqual('Application reference has already been processed')
        expect(context.bindings.outputSbQueue).toBeFalsy()
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
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
        await processDeveloperApplication(getContext(), 'dsjjhdsjf')

        const context = getContext()
        expect(context.res.status).toEqual(400)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
