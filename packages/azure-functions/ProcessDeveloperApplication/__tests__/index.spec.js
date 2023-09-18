import processDeveloperApplication from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import applicationStatuses from '../../Shared/application-statuses.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    developerAllocation: {
      applicant: {
        name: 'Test Applicant',
        emailAddress: 'test@example.com',
        role: 'Developer'
      },
      developmentDetails: {
        projectName: 'Test Project',
        localAuthority: 'Test Authority',
        planningReference: 'Test Application reference'
      },
      additionalEmailAddresses: [
        {
          fullName: 'Test1',
          email: 'test1@example.com'
        },
        {
          fullName: 'Test2',
          email: 'test2@example.com'
        }
      ],
      biodiversityGainSiteNumber: 'AZ12208461',
      metricData: {
        startPage: {
          planningAuthority: 'Test Authority',
          projectName: 'Test Project',
          applicant: 'Test',
          applicationType: 'Test',
          planningApplicationReference: 'Test Application reference',
          completedBy: 'Test 1',
          dateOfMetricCompletion: 44907,
          reviewer: 'Test 3',
          versionControl: 4
        },
        d1: [
          {
            'Broad habitat': 'Cropland',
            'Habitat type': 'Cereal crops',
            'Area (hectares)': 1,
            'Total habitat units': 2,
            Condition: 'Condition Assessment N/A'
          }
        ],
        d2: [
          {
            'Delay in starting habitat creation (years)': 0,
            'Broad habitat': 'Grassland',
            'Proposed habitat': 'Other neutral grassland',
            'Area (hectares)': 0.9,
            Condition: 'Fairly Good',
            'Habitat units delivered': 7.0134822603,
            'Habitat created in advance (years)': 0
          }
        ],
        d3: [
          {
            'Baseline habitat': 'Grassland - Modified grassland',
            'Proposed Broad Habitat': 'Wetland',
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Area (hectares)': 1,
            Condition: 'Good',
            'Habitat units delivered': 7.027257226998999,
            'Proposed habitat': 'Lowland raised bog'
          }
        ],
        e1: [
          {
            'Hedgerow type': 'Native hedgerow - associated with bank or ditch',
            'Length (km)': 0.3,
            'Total hedgerow units': 1.2,
            Condition: 'Poor'
          }
        ],
        e2: [
          {
            'Habitat type': 'Native hedgerow with trees',
            'Length (km)': 0.3,
            'Delay in starting habitat creation (years)': 0,
            'Hedge units delivered': 1.7654229486,
            Condition: 'Good',
            'Habitat created in advance (years)': 0
          }
        ],
        e3: [
          {
            'Baseline habitat': 'Native hedgerow - associated with bank or ditch',
            'Length (km)': 0.3,
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Proposed habitat': 'Native hedgerow - associated with bank or ditch',
            'Hedge units delivered': 2.27835855,
            Condition: 'Moderate'
          }
        ],
        f1: [
          {
            'Watercourse type': 'Ditches',
            'Length (km)': 0.3,
            'Total watercourse units': 1.2,
            Condition: 'Poor'
          }
        ],
        f2: [
          {
            'Watercourse type': 'Ditches',
            'Habitat created in advance (years)': 0,
            'Delay in starting habitat creation (years)': 0,
            'Watercourse units delivered': 2.594403979575,
            Condition: 'Fairly Good',
            'Length (km)': 0.3
          }
        ],
        f3: [
          {
            'Baseline habitat': 'Ditches',
            'Length (km)': 0.3,
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Proposed habitat': 'Ditches',
            'Watercourse units delivered': 2.409217854828,
            Condition: 'Good'
          }
        ]
      },
      submittedOn: '2023-05-30T14:58:08.279Z',
      files: [
        {
          contentMediaType: null,
          fileType: 'developer-upload-metric',
          fileSize: null,
          fileLocation: null,
          fileName: null
        },
        {
          contentMediaType: null,
          fileType: 'developer-upload-consent',
          fileSize: null,
          fileLocation: null,
          fileName: null
        }
      ],
      payment: {
        caseType: 'allocation',
        fee: 59,
        reference: '',
        type: 'BACS'
      }
    }
  }
}

const gainSiteReference = 'BNGREG-JDSJ3-A4LI9'

describe('Processing an application', () => {
  it('should process valid application without a reference number successfully', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.createApplicationReference = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                fn_create_application_reference: gainSiteReference
              }
            ]
          }
        })
        // execute function
        await processDeveloperApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.developerAllocation.referenceNumber).toEqual(gainSiteReference)
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
        req.body.developerAllocation.gainSiteReference = gainSiteReference
        // execute function
        await processDeveloperApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.developerAllocation.gainSiteReference).toEqual(gainSiteReference)
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
        req.body.developerAllocation.gainSiteReference = gainSiteReference
        // execute function
        await processDeveloperApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(context.res.body.applicationReference).toEqual(gainSiteReference)
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
