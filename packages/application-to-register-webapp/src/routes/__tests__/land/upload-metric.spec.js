import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const url = '/land/upload-metric-file'

const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/metric-file'
jest.mock('../../../utils/azure-signalr.js')

describe('Metric file upload controller tests', () => {
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
      uploadType: 'metric-upload',
      url,
      formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
      eventData: mockLegalAgreement
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })

    it('should upload metric file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = false
        uploadConfig.filePath = `${mockDataPath}/metric-file.xlsx`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should upload metric document less than 50 MB', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.filePath = `${mockDataPath}/metric-file.xlsx`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload unsupported metric file', (done) => {
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

    it('should not upload no selected file metric', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload empty metric file', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        uploadConfig.filePath = `${mockDataPath}/empty-metric-file.xlsx`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should not upload metric file more than 50 MB', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.hasError = true
        uploadConfig.filePath = `${mockDataPath}/big-metric.xlsx`
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should cause an internal server error response when upload processing fails', (done) => {
      jest.isolateModules(async () => {
        const config = Object.assign({}, baseConfig)
        config.filePath = `${mockDataPath}/metric-file.xlsx`
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
