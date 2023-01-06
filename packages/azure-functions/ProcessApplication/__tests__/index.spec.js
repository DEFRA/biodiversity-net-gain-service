import processApplication from '../index.mjs'
import { getContext } from '../../.jest/setup.js'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

const req = {
  body: {
    landownerGainSiteRegistration: {
      applicant: {
        firstName: null,
        lastName: null,
        role: null
      },
      landBoundaryGridReference: null,
      landBoundaryHectares: null,
      submittedOn: '2022-10-03T09:29:14.909Z',
      files: [{
        contentMediaType: 'application/msword',
        fileType: 'legal-agreement',
        fileSize: '0.01',
        fileLocation: '09e857da-e63a-4ef7-adab-e422682b0267/legal-agreement/legal-agreement.doc',
        fileName: 'legal-agreement.doc'
      }, {
        contentMediaType: null,
        fileType: 'land-boundary',
        fileSize: null,
        fileLocation: null,
        fileName: null
      }, {
        contentMediaType: null,
        fileType: 'management-plan',
        fileSize: null,
        fileLocation: null,
        fileName: null
      }, {
        contentMediaType: null,
        fileType: 'metric',
        fileSize: null,
        fileLocation: null,
        fileName: null
      }]
    }
  }
}

describe('Processing an application', () => {
  /*
    Happy paths
      Should process valid application successfully
    Sad paths
      application process fails due to malformed content
  */
  it('Should process valid application successfully', done => {
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
        // execute function
        await processApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.landownerGainSiteRegistration.gainSiteReference).toEqual('REF0601220001')
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
        await processApplication(getContext(), 'sdvcsdgdsgf')

        const context = getContext()
        expect(context.res.status).toEqual(400)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
