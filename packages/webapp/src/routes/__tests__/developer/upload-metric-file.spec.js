import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'

const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const url = constants.routes.DEVELOPER_UPLOAD_METRIC

jest.mock('../../../utils/azure-signalr.js')

describe(url, () => {
  beforeAll(async () => {
    await recreateQueues()
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const mockDevMetricData = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        metricData: {}
      }
    ]
    const baseConfig = {
      uploadType: 'developer-upload-metric',
      url,
      formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
      eventData: mockDevMetricData,
      containerName: 'untrusted'
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })

    it('should upload a valid Metric File to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.headers = {
            referer: 'http://localhost:3000/developer/check-metric-file'
          }
          const response = await uploadFile(config)
          expect(response.payload).toBe('')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload a 50MB Metric file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.xlsx`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload a developer metric file more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.xlsx`
          const response = await uploadFile(uploadConfig)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must not be larger than 50MB')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload a developer metric larger than the configured maximum', (done) => {
      jest.isolateModules(async () => {
        try {
          process.env.MAX_METRIC_UPLOAD_MB = 49
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/50MB.xlsx`
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(`The selected file must not be larger than ${process.env.MAX_METRIC_UPLOAD_MB}MB`)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should cause an internal server error response when upload notification processing fails for an unexpected reason', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateHandleEventsError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an unsupported file type is uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/wrong-extension.txt`
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an empty file is uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/empty-metric-file.xlsx`
          config.generateInvalidFeatureCountError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file is empty')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when upload screening detects a threat', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateThreatDetectedError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain(constants.uploadErrors.threatDetected)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when upload screening fails', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateThreatScreeningFailure = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain(constants.uploadErrors.uploadFailure)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an upload fails due to a timeout', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateUploadTimeoutError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain(constants.uploadErrors.uploadFailure)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should cause an internal server error when an unexpected validation error code is received', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateUnexpectedValidationError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when non-file data is uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('Select a Biodiversity Metric')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
