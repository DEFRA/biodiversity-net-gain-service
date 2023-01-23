import processApplication from '../index.mjs'
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
      Should process valid application without a reference successfully
      Should process valid application with a reference successfully
      Should request DB access token if no password supplied for database

    Sad paths
      application process fails due to malformed content
  */
  it('Should process valid application without a reference successfully', done => {
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
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should process valid application with a reference successfully', done => {
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
        req.body.landownerGainSiteRegistration.gainSiteReference = 'test'
        // execute function
        await processApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.landownerGainSiteRegistration.gainSiteReference).toEqual('test')
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should request DB access token if no password supplied for database', done => {
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
        const { DefaultAzureCredential } = require('@azure/identity')
        DefaultAzureCredential.prototype.getToken = jest.fn().mockImplementation(() => {
          return {
            token: 'test'
          }
        })
        req.body.landownerGainSiteRegistration.gainSiteReference = ''
        dbConfig.default.password = ''
        // execute function
        await processApplication(getContext(), req)
        const context = getContext()
        expect(context.res.status).toEqual(200)
        expect(context.bindings.outputSbQueue).toEqual(req.body)
        expect(context.bindings.outputSbQueue.landownerGainSiteRegistration.gainSiteReference).toEqual('REF0601220001')
        expect(dbQueries.createApplicationReference.mock.calls).toHaveLength(1)
        expect(DefaultAzureCredential.prototype.getToken.mock.calls).toHaveLength(1)
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
