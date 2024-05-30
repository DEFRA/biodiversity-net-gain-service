import { submitPostRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'

export const UPLOAD_METRIC_FORM_ELEMENT_NAME = 'uploadMetric'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'

export const getBaseConfig = (uploadType, url) => ({
  uploadType,
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

export const beforeEachSetup = async () => {
  await recreateContainers()
}

export const runCommonUploadTests = (uploadType, url, constants) => {
  describe('POST', () => {
    beforeEach(async () => {
      await beforeEachSetup()
    })

    // it('should upload metric file to cloud storage', (done) => {
    //   jest.isolateModules(async () => {
    //     try {
    //       const uploadConfig = getBaseConfig(uploadType, url)
    //       uploadConfig.hasError = false
    //       uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
    //       await uploadFile(uploadConfig)
    //       setImmediate(() => {
    //         done()
    //       })
    //     } catch (err) {
    //       done(err)
    //     }
    //   })
    // }, 300000)

    // SHOULD UPLOAD VALID METRIC FILE
    it('should upload valid metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
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
    })

    // SHOULD NOT UPLOAD METRIC FILE MORE THAN 50MB
    it('should not upload metric file more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/big-metric.xlsx`
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('The selected file must not be larger than 50MB')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    // SHOULD NOT UPLOAD METRIC FILE LARGER THAN CONFIGURED MAXIMUM
    it('should not upload metric file larger than configured maximum', (done) => {
      jest.isolateModules(async () => {
        try {
          process.env.MAX_METRIC_UPLOAD_MB = 49
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/50MB.xlsx`
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

    // SHOULD NOT UPLOAD UNSUPPORTED METRIC FILE
    it('should not upload unsupported metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
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

    // SHOULD NOT UPLOAD NO SELECTED FILE METRIC
    it('should not upload no selected file metric', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
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

    // SHOULD NOT UPLOAD EMPTY METRIC FILE
    it('should not upload empty metric file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
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

    // SHOULD HANDLE UNSPECIFIED ERROR
    it('should handle unspecified error', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/metric-file.xlsx`
          uploadConfig.generateHandleEventsError = true
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('The selected file could not be uploaded -- try again')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    // SHOULD DISPLAY EXPECTED ERROR WHEN UPLOAD FAILS DUE TO TIMEOUT
    it('should display expected error when upload fails due to timeout', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = getBaseConfig(uploadType, url)
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

    // SHOULD CAUSE INTERNAL SERVER ERROR RESPONSE WHEN UPLOAD PROCESSING FAILS
    it('should cause internal server error response when upload processing fails', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.uploadType = null
          uploadConfig.filePath = `${mockDataPath}/metric-file.xlsx`
          uploadConfig.generateHandleEventsError = true
          uploadConfig.hasError = true
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain(constants.uploadErrors.uploadFailure)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    // SHOULD HANDLE FAIL ACTION OF UPLOAD ROUTE
    it('should handle fail action of upload route', (done) => {
      const expectedStatusCode = 415
      submitPostRequest({ url, payload: { parse: true } }, expectedStatusCode)
        .then((res) => {
          expect(res.statusCode).toEqual(expectedStatusCode)
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    // VALIDATION TESTS

    // SHOULD RETURN VALIDATION ERROR MESSAGE IF NOT V4 METRIC
    // THIS TEST IS NOT WORKING - POSSIBLY SOMETHING TO DO WITH INCORRECT ERROR MESSAGES
    // CHECK ERROR MESSAGES AND COMPARE AND REWRITE TEST

    // it('should return validation error message if not v4 metric', (done) => {
    //   jest.isolateModules(async () => {
    //     try {
    //       const uploadConfig = getBaseConfig(uploadType, url)
    //       uploadConfig.hasError = true
    //       uploadConfig.filePath = `${mockDataPath}/metric-file.xlsx`
    //       uploadConfig.postProcess.metricData.validation = {
    //         isSupportedVersion: false,
    //         isOffsiteDataPresent: false,
    //         areOffsiteTotalsCorrect: false
    //       }
    //       const res = await uploadFile(uploadConfig)
    //       expect(res.result).toContain('There is a problem')
    //       expect(res.result).toContain('The selected file must use the statutory biodiversity metric')
    //       setImmediate(() => {
    //         done()
    //       })
    //     } catch (err) {
    //       done(err)
    //     }
    //   })
    // })

    // SHOULD RETURN VALIDATION ERROR MESSAGE IF FAILS OFFSITE DATA PRESENT
    it('should return validation error message if fails isOffSiteDataPresent', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
          uploadConfig.postProcess.metricData.validation.isOffsiteDataPresent = false
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('The selected file does not have enough data')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    // SHOULD RETURN VALIDATION ERROR MESSAGE IF DRAFT VERSION
    it('should return validation error message if metric is draft version', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = getBaseConfig(uploadType, url)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/metric-file-4.1.xlsm`
          uploadConfig.postProcess.metricData.validation.isDraftVersion = true
          const res = await uploadFile(uploadConfig)
          expect(res.result).toContain('There is a problem')
          expect(res.result).toContain('The selected file must not be a draft version')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })
  })
}
