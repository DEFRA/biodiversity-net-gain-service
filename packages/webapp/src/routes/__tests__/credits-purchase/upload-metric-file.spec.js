import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import * as azureStorage from '../../../utils/azure-storage.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'

describe('Metric file upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const getBaseConfig = () => ({
      uploadType: creditsPurchaseConstants.uploadTypes.CREDITS_PURCHASE_METRIC_UPLOAD_TYPE,
      url,
      formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
      postProcess: {
        metricData: {
          validation: {
            isSupportedVersion: true,
            isOffsiteDataPresent: true,
            areOffsiteTotalsCorrect: true,
            isDraftVersion: false
          }
        }
      },
      sessionData: {}
    })

    beforeEach(async () => {
      await recreateContainers()
    })

    it('should upload metric file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    }, 300000)

    it('should upload feb24 format metric file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1-feb24.xlsm`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    }, 300000)

    it('should not upload unsupported metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('The selected file must be an XLSM or XLSX')
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
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = true
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('Select a statutory biodiversity metric')
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
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-metric-file.xlsx`
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('The selected file is empty')
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
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/big-metric.xlsx`
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain(`The selected file must not be larger than ${process.env.MAX_METRIC_UPLOAD_MB}MB`)
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
          const uploadConfig = getBaseConfig()
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
          const config = getBaseConfig()
          config.uploadType = null
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
          const config = getBaseConfig()
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.hasError = true
          config.postProcess.metricData.validation = {
            isSupportedVersion: false,
            isOffsiteDataPresent: false,
            areOffsiteTotalsCorrect: false
          }
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file must use Biodiversity Metric version 4.1')
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
          const config = getBaseConfig()
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.hasError = true
          config.postProcess.metricData.validation = {
            isSupportedVersion: true,
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

    it('should return validation error message if fails isDraftVersion', (done) => {
      jest.isolateModules(async () => {
        try {
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = getBaseConfig()
          config.filePath = `${mockDataPath}/metric-4.1-draft.xlsm`
          config.hasError = true
          config.postProcess.metricData.validation = {
            isSupportedVersion: true,
            isOffsiteDataPresent: true,
            areOffsiteTotalsCorrect: true,
            isDraftVersion: true
          }
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file must not be a draft version')
          expect(spy).toHaveBeenCalledTimes(1)
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
          const config = Object.assign({ uploadType: null }, getBaseConfig())
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateHandleEventsError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain(creditsPurchaseConstants.uploadErrors.uploadFailure)
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
  })
})
