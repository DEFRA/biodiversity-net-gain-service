import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
import * as azureStorage from '../../../utils/azure-storage.js'
const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const url = constants.routes.DEVELOPER_UPLOAD_METRIC

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
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
    const mockMetric = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        metricData: {
          d1: [{ 'Off-site reference': 'AZ12208461' }],
          validation: {
            isVersion4OrLater: true,
            isOffsiteDataPresent: true,
            areOffsiteTotalsCorrect: true
          }
        }
      }
    ]
    const baseConfig = {
      uploadType: constants.uploadTypes.METRIC_UPLOAD_TYPE,
      url,
      formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
      eventData: mockMetric
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })

    it('should upload metric file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.0.xlsm`
          uploadConfig.sessionData = {}
          uploadConfig.sessionData[`${constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER}`] = 'AZ12208461'
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload metric document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.0.xlsm`
          uploadConfig.sessionData = {}
          uploadConfig.sessionData[`${constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER}`] = 'AZ12208461'
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload unsupported metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload no selected file metric', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload empty metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-metric-file.xlsx`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload metric file more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/big-metric.xlsx`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload a landowner metric larger than the configured maximum', (done) => {
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

    it('should cause an internal server error response when upload processing fails', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({ uploadType: null }, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateHandleEventsError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('The selected file could not be uploaded -- try again')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should return validation error message if not v4 metric', (done) => {
      jest.isolateModules(async () => {
        try {
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.hasError = true
          config.eventData[0].metricData.validation = {
            isVersion4OrLater: false,
            isOffsiteDataPresent: false,
            areOffsiteTotalsCorrect: false
          }
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file must use Biodiversity Metric version 4.0')
          expect(spy).toHaveBeenCalledTimes(1)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should return validation error message if fails isOffSiteDataPresent', (done) => {
      jest.isolateModules(async () => {
        try {
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.hasError = true
          config.eventData[0].metricData.validation = {
            isVersion4OrLater: true,
            isOffsiteDataPresent: false,
            areOffsiteTotalsCorrect: false
          }
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file does not have enough data')
          expect(spy).toHaveBeenCalledTimes(1)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should return validation error message if fails areOffsiteTotalsCorrect', (done) => {
      jest.isolateModules(async () => {
        try {
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.hasError = true
          config.eventData[0].metricData.validation = {
            isVersion4OrLater: true,
            isOffsiteDataPresent: true,
            areOffsiteTotalsCorrect: false
          }
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file has an error - the baseline total area does not match the created and enhanced total area for the off-site')
          expect(spy).toHaveBeenCalledTimes(1)
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
          const config = Object.assign({ uploadType: null }, baseConfig)
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateUploadTimeoutError = true
          // config.hasError = true
          const response = await uploadFile(config)
          expect(response.result).toBe('')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should handle failAction of upload route', async () => {
      const expectedStatuCode = 415
      const res = await submitPostRequest({ url, payload: { parse: true } }, expectedStatuCode)
      expect(res.statusCode).toEqual(expectedStatuCode)
    })

    it('should display error if off-site reference is not matching', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.0.xlsm`
          uploadConfig.sessionData = {}
          uploadConfig.hasError = true
          uploadConfig.sessionData[`${constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER}`] = 'AZ000001'
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('Enter the off-site reference that matches the off-site reference in the uploaded metric.')
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
