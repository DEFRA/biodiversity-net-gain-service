import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
const LEGAL_AGREEMENT_FORM_ELEMENT_NAME = 'legalAgreement'
const url = '/land/upload-legal-agreement-file'

const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('../../../utils/azure-signalr.js')

describe('Legal agreement upload controller tests', () => {
  beforeAll(async () => {
    await recreateQueues()
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const mockLegalAgreement = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        mapConfig: {}
      }
    ]
    const baseConfig = {
      uploadType: 'legal-agreement',
      url,
      formName: LEGAL_AGREEMENT_FORM_ELEMENT_NAME,
      eventData: mockLegalAgreement
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })

    it('should upload legal agreement document to cloud storage', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = false
        uploadConfig.filePath = `${mockDataPath}/legal-agreement.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should upload legal agreement document less than 50 MB', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload legal agreement document less than 50 MB', (done) => {
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

    it('should not upload empty legal agreement', (done) => {
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

    it('should not upload unsupported legal agreement', (done) => {
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

    it('should not upload nofile legal agreement', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should  upload legal agreement document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should cause an internal server error response when upload notification processing fails', (done) => {
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
