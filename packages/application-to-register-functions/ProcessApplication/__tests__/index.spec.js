import processApplication from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
jest.mock('@defra/bng-connectors-lib')
const { serviceBusConnector } = require('@defra/bng-connectors-lib')
serviceBusConnector.init = jest.fn().mockImplementation(() => {})

const mockSendMessage = async (message) => {
  return ''
}

const mockSendMessageErr = async (message) => {
  throw new Error('test error')
}

const req = {
  body: {
    userId: '09e857da-e63a-4ef7-adab-e422682b0267',
    landownerGainSiteRegistration: {
      applicant: {
        firstName: null,
        lastName: null,
        role: null
      },
      gainSiteReference: '09e857da-e63a-4ef7-adab-e422682b0267',
      landBoundaryGridReference: null,
      landBoundaryHectares: null,
      submittedOn: '2022-10-03T09:29:14.909Z',
      files: [{
        contentMediaType: 'application/msword',
        fileType: '1/legal-agreement',
        fileSize: '0.01',
        fileLocation: '09e857da-e63a-4ef7-adab-e422682b0267/legal-agreement/legal-agreement.doc',
        fileName: 'legal-agreement.doc'
      }, {
        contentMediaType: null,
        fileType: '2/land-boundary',
        fileSize: null,
        fileLocation: null,
        fileName: null
      }, {
        contentMediaType: null,
        fileType: '3/management-plan',
        fileSize: null,
        fileLocation: null,
        fileName: null
      }, {
        contentMediaType: null,
        fileType: '4/metric',
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
      application process fails due to failed service bus call
  */
  it('Should process valid application successfully', done => {
    jest.isolateModules(async () => {
      try {
        const { serviceBusConnector } = require('@defra/bng-connectors-lib')
        serviceBusConnector.sendMessage = jest.fn().mockImplementation(mockSendMessage)
        // execute function
        await processApplication(getContext(), req)

        expect(serviceBusConnector.sendMessage).toHaveBeenCalled()
        const context = getContext()
        expect(context.res.body).toEqual('{"gainSiteReference":"09e857da-e63a-4ef7-adab-e422682b0267"}')
        expect(context.res.status).toEqual(200)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should return 400 response if malformed content', done => {
    jest.isolateModules(async () => {
      try {
        const { serviceBusConnector } = require('@defra/bng-connectors-lib')
        serviceBusConnector.sendMessage = jest.fn().mockImplementation(mockSendMessage)
        // execute function
        await processApplication(getContext(), 'sdvcsdgdsgf')

        expect(serviceBusConnector.sendMessage).not.toHaveBeenCalled()
        const context = getContext()
        expect(context.res.status).toEqual(400)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should return 400 response if failed service bus call', done => {
    jest.isolateModules(async () => {
      try {
        const { serviceBusConnector } = require('@defra/bng-connectors-lib')
        serviceBusConnector.sendMessage = jest.fn().mockImplementation(mockSendMessageErr)
        // execute function
        await processApplication(getContext(), req)

        expect(serviceBusConnector.sendMessage).toHaveBeenCalled()
        const context = getContext()
        expect(context.res.status).toEqual(400)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
