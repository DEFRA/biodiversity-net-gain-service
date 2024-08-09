import processCombinedCaseApplication from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import applicationStatuses from '../../Shared/application-statuses.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    combinedCase: {
      applicant: {
        id: 'ca32f764-a3d0-ee11-9079-6045bd90523f',
        role: 'agent'
      },
      registrationDetails: {
        habitats: {
          baseline: [
            {
              habitatType: 'Cropland - Cereal crops',
              baselineReference: '1',
              module: 'Baseline',
              state: 'Habitat',
              condition: 'Condition Assessment N/A',
              area: {
                beforeEnhancement: 1.324,
                afterEnhancement: 0
              },
              measurementUnits: 'hectares'
            }
          ],
          proposed: [
            {
              habitatType: 'Grassland - Other neutral grassland',
              baselineReference: '',
              module: 'Created',
              state: 'Habitat',
              condition: 'Good',
              strategicSignificance: 'Area/compensation not in local strategy/ no local strategy',
              advanceCreation: 0,
              delayedCreation: 0,
              area: 1.324,
              measurementUnits: 'hectares'
            }
          ]
        },
        landBoundaryGridReference: 'SE170441',
        landBoundaryHectares: 2,
        legalAgreementType: '759150001',
        enhancementWorkStartDate: '2023-01-01T00:00:00.000Z',
        legalAgreementEndDate: '2057-01-01T00:00:00.000Z',
        habitatPlanIncludedLegalAgreementYesNo: 'Yes',
        landowners: {
          organisation: [],
          individual: [
            {
              firstName: 'test',
              lastName: 'test',
              email: 'test@test.com'
            }
          ]
        },
        conservationCovernantResponsibleBodies: [
          {
            responsibleBodyName: 'test'
          }
        ]
      },
      allocationDetails: {
        gainSite: {
          offsiteUnitChange: {
            habitat: 0,
            hedge: 0,
            watercourse: 0
          }
        },
        habitats: {
          allocated: [
            {
              habitatId: 'HAB-00000000-0',
              area: 1.324,
              module: 'Created',
              state: 'Habitat',
              measurementUnits: 'hectares'
            }
          ]
        },
        development: {
          localPlanningAuthority: {
            code: 'E60000251',
            name: 'Test Valley LPA'
          },
          planningReference: 'test',
          name: 'test'
        }
      },
      files: [
        {
          contentMediaType: 'application/pdf',
          fileType: 'land-ownership',
          fileSize: 13264,
          fileLocation: '627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile2.pdf',
          fileName: 'lopfile2.pdf'
        },
        {
          contentMediaType: 'application/pdf',
          fileType: 'land-ownership',
          fileSize: 13264,
          fileLocation: '627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile1.pdf',
          fileName: 'lopfile1.pdf'
        },
        {
          contentMediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fileType: 'legal-agreement',
          fileSize: 7377,
          fileLocation: '7cab6365-db01-4a4b-ae77-52c0c68416fa/legal-agreement/testDoc.docx',
          fileName: 'testDoc.docx'
        },
        {
          contentMediaType: 'application/msword',
          fileType: 'land-boundary',
          fileSize: 0.01,
          fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-boundary/legal-agreement.doc',
          fileName: 'legal-agreement.doc'
        },
        {
          contentMediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          fileType: 'metric',
          fileSize: 4240880,
          fileLocation: '75e2ee81-1646-42c3-9fa2-47dba5cdda40/metric-upload/CC-DEV-BNGREG-M7T5N-BQ3Z4_Metric.xlsx',
          fileName: 'CC-DEV-BNGREG-M7T5N-BQ3Z4_Metric.xlsx'
        },
        {
          contentMediaType: 'application/msword',
          fileType: 'local-land-charge',
          fileSize: 0.01,
          fileLocation: '800376c7-8652-4906-8848-70a774578dfe/local-land-charge/local-land-charge.doc',
          fileName: 'local-land-charge.doc'
        },
        {
          contentMediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          fileType: 'written-authorisation',
          fileSize: 7377,
          fileLocation: '2f5ea5cb-e28b-4161-abb7-0a24d1bc1ba3/written-authorisation/testDoc.docx',
          fileName: 'testDoc.docx'
        }
      ],
      applicationReference: 'BNGREG-DISVN-A9Y8Q',
      submittedOn: '2024-08-09T14:43:44.753Z',
      payment: {
        reference: 'BNGREG-DISVN-A9Y8Q',
        method: 'BACS'
      },
      agent: {
        clientType: 'individual',
        clientAddress: {
          type: 'uk',
          line1: 'test',
          town: 'test',
          line2: 'test',
          postcode: 'm11mm',
          county: 'test'
        },
        clientNameIndividual: {
          firstName: 'test',
          lastName: 'test'
        },
        clientEmail: 'test@Test.com',
        clientPhoneNumber: '12323453453'
      }
    }
  }
}

const applicationReference = 'BNGREG-DISVN-A9Y8Q'

describe('Processing an application', () => {
  it('should process valid application without a reference number successfully', done => {
    jest.isolateModules(async () => {
      try {
        const dbQueries = require('../../Shared/db-queries.js')
        dbQueries.createApplicationReference = jest.fn().mockImplementation(() => {
          return {
            rows: [
              {
                application_reference: applicationReference
              }
            ]
          }
        })
        dbQueries.getApplicationStatus = jest.fn().mockImplementation(() => {
          return {
            rows: []
          }
        })
        // execute function
        const reqWithoutRef = { ...req }
        req.body.combinedCase.applicationReference = null
        await processCombinedCaseApplication(getContext(), reqWithoutRef)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.combinedCase.applicationReference).toEqual(applicationReference)
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
        req.body.combinedCase.applicationReference = applicationReference
        // execute function
        await processCombinedCaseApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.combinedCase.applicationReference).toEqual(applicationReference)
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
        req.body.combinedCase.applicationReference = applicationReference
        // execute function
        await processCombinedCaseApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(400)
        expect(context.res.body.applicationReference).toEqual(applicationReference)
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
        await processCombinedCaseApplication(getContext(), 'dsjjhdsjf')

        const context = getContext()
        expect(context.res.status).toEqual(400)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
