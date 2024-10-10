import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
import * as azureStorage from '../../../utils/azure-storage.js'

const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const url = constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const metricFiles = [
  `${mockDataPath}/metric-file-4.1.xlsm`,
  `${mockDataPath}/metric-file-4.1-feb24.xlsm`
]

const mockHabitat = {
  'Baseline habitat': 'Grassland - Modified grassland',
  'Total habitat area': 1,
  'Proposed Broad Habitat': 'Wetland',
  'Condition change': 'Lower Distinctiveness Habitat - Good',
  'Habitat enhanced in advance (years)': 0,
  'Delay in starting habitat enhancement (years)': 0,
  'Off-site reference': 'BGS-111 222 333',
  'Area (hectares)': 1,
  Condition: 'Good',
  'Habitat units delivered': 7.027257226998999,
  'Proposed habitat': 'Lowland raised bog',
  'Distinctiveness change': 'Low - V.High',
  'Habitat reference Number': '1234DEF'
}

describe('Metric file upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const getBaseConfig = () => ({
      uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
      url,
      formName: UPLOAD_METRIC_FORM_ELEMENT_NAME,
      postProcess: {
        metricData: {
          d2: [{ 'Off-site reference': 'AZ12208461' }],
          e2: [],
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

    metricFiles.forEach(file => {
      it(`should upload metric file to cloud storage and allow a journey to proceed if the persistence of journey data fails for ${file}`, (done) => {
        jest.isolateModules(async () => {
          try {
            jest.resetAllMocks()
            jest.mock('../../../utils/http.js')
            const http = require('../../../utils/http.js')
            // Ensure the call to persist journey data fails.
            http.postJson = jest.fn().mockImplementation(() => {
              return Promise.reject(new Error('Error'))
            })
            const uploadConfig = getBaseConfig()
            uploadConfig.filePath = file
            uploadConfig.sessionData[`${constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER}`] = 'AZ12208461'
            uploadConfig.sessionData[`${constants.redisKeys.CONTACT_ID}`] = 'mock contact ID'
            uploadConfig.sessionData[`${constants.redisKeys.APPLICATION_TYPE}`] = constants.applicationTypes.ALLOCATION
            uploadConfig.sessionData[`${constants.redisKeys.DEVELOPER_APP_REFERENCE}`] = 'mock developer app reference'
            await uploadFile(uploadConfig)
            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })
    })

    metricFiles.forEach(file => {
      it(`should upload metric ${file} document less than 50MB`, (done) => {
        jest.isolateModules(async () => {
          try {
            const uploadConfig = getBaseConfig()
            uploadConfig.filePath = file
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
    })

    it('should not upload unsupported metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
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
          const uploadConfig = getBaseConfig()
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
          const uploadConfig = getBaseConfig()
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
          const uploadConfig = getBaseConfig()
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/big-metric.xlsx`
          uploadConfig.sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.COMBINED_CASE
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
          expect(response.payload).toContain('The selected file could not be uploaded')
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

    it('should return validation error message if not v4.1 metric', (done) => {
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

    it('should display expected error details when an upload fails due to a timeout', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = getBaseConfig()
          config.uploadType = null
          config.filePath = `${mockDataPath}/metric-file.xlsx`
          config.generateUploadTimeoutError = true
          config.hasError = true
          const res = await uploadFile(config)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(constants.uploadErrors.uploadFailure)
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

    it('should succeed if habitat matches found', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
          uploadConfig.sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.COMBINED_CASE
          uploadConfig.sessionData[constants.redisKeys.METRIC_DATA] = {
            d3: [{ ...mockHabitat }]
          }
          uploadConfig.postProcess.metricData = {
            d3: [{ ...mockHabitat }],
            validation: {
              isSupportedVersion: true,
              isOffsiteDataPresent: true,
              areOffsiteTotalsCorrect: true,
              isDraftVersion: false
            }
          }
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should return error message if no habitat matches found', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig()
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
          uploadConfig.hasError = true
          uploadConfig.sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.COMBINED_CASE
          uploadConfig.sessionData[constants.redisKeys.METRIC_DATA] = {
            d3: [{ ...mockHabitat }]
          }
          uploadConfig.postProcess.metricData = {
            d3: [],
            validation: {
              isSupportedVersion: true,
              isOffsiteDataPresent: true,
              areOffsiteTotalsCorrect: true,
              isDraftVersion: false
            }
          }
          const response = await uploadFile(uploadConfig)
          expect(response.result).toContain('The habitats in your development metric cannot be matched to any habitats in your registration metric. Please check both metrics to ensure the details are correct.')
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
