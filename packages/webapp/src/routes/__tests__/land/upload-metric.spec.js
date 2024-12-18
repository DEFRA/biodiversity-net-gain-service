import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
import * as azureStorage from '../../../utils/azure-storage.js'
const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const url = constants.routes.UPLOAD_METRIC

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'

describe('Metric file upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const getBaseConfig = () => ({
      uploadType: 'metric-upload',
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
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainersWithCheck')
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/register-land-task-list'
          }
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          await uploadFile(uploadConfig)
          expect(spy).toHaveBeenCalledTimes(1)
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
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainersWithCheck')
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1-feb24.xlsm`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/register-land-task-list'
          }
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          await uploadFile(uploadConfig)
          expect(spy).toHaveBeenCalledTimes(1)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    }, 300000)

    it('should upload metric document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
          uploadConfig.filePath = `${mockDataPath}/metric-file.xlsx`
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
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
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('The selected file must be an XLSM or XLSX')
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
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('Select a statutory biodiversity metric')
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
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('The selected file is empty')
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
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('The selected file must not be larger than 50MB')
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
          uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
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
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateHandleEventsError = true
          config.hasError = true
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should return error if valid spreadsheet is not a valid metric', (done) => {
      jest.isolateModules(async () => {
        try {
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = getBaseConfig()
          config.filePath = `${mockDataPath}/not-metric-file.xlsx`
          config.hasError = true
          config.postProcess.errorMessage = constants.uploadErrors.notValidMetric
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file is not a valid Metric')
          expect(spy).toHaveBeenCalledTimes(1)
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
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file must use the statutory biodiversity metric')
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
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
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
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
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
    // BNGP-4219 METRIC Validation: Suppress total area calculations
    it.skip('should return validation error message if fails areOffsiteTotalsCorrect', (done) => {
      jest.isolateModules(async () => {
        try {
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = getBaseConfig()
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.hasError = true
          config.postProcess.metricData.validation = {
            isSupportedVersion: true,
            isOffsiteDataPresent: true,
            areOffsiteTotalsCorrect: false
          }
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const response = await uploadFile(config)
          expect(response.result).toContain('The selected file has an error - the baseline total area does not match the created and enhanced total area for the off-site')
          expect(spy).toHaveBeenCalledTimes(2)
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
          config.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.REGISTRATION
          const response = await uploadFile(config)
          expect(response.payload).toContain(constants.uploadErrors.uploadFailure)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should handle failAction of upload route', async () => {
      const expectedStatusCode = 415
      const res = await submitPostRequest({ url, payload: { parse: true } }, expectedStatusCode)
      expect(res.statusCode).toEqual(expectedStatusCode)
    })
  })
})
