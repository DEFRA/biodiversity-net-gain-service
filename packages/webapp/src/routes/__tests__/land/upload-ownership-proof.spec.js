import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
const PROOF_OF_OWNERSHIP_FORM_ELEMENT_NAME = 'landOwnership'
const url = '/land/upload-ownership-proof'

const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('../../../utils/azure-signalr.js')

describe('Proof of ownership upload controller tests', () => {
  beforeAll(async () => {
    await recreateQueues()
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const mockLandOwnership = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        mapConfig: {}
      }
    ]
    const baseConfig = {
      uploadType: 'land-ownership',
      url,
      formName: PROOF_OF_OWNERSHIP_FORM_ELEMENT_NAME,
      eventData: mockLandOwnership
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })

    it('should upload land ownership document to cloud storage', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.referer = 'http://localhost:30000/land/check-ownership-details'
        uploadConfig.hasError = false
        uploadConfig.filePath = `${mockDataPath}/legal-agreement.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should upload land ownership document less than 50 MB', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload land ownership document less than 50 MB', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        uploadConfig.filePath = `${mockDataPath}/55MB.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload empty land ownership', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        uploadConfig.filePath = `${mockDataPath}/empty-legal-agreement.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload unsupported land ownership document', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload nofile land ownership file', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        await uploadFile(uploadConfig, 200)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should  upload land ownership document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should cause an internal server error response when land ownership upload notification processing fails', (done) => {
      jest.isolateModules(async () => {
        const config = Object.assign({}, baseConfig)
        config.filePath = `${mockDataPath}/legal-agreement.pdf`
        config.generateHandleEventsError = true
        config.hasError = true
        await uploadFile(config)
        setImmediate(() => {
          done()
        })
      })
    })
  })
})
