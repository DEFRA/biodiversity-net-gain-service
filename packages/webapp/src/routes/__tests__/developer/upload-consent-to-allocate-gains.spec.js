import { submitGetRequest, submitPostRequest, uploadFile } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'

const url = constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS
const UPLOAD_CONSENT_FORM_ELEMENT_NAME = 'uploadWrittenConsentToAllocateGains'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/consent-to-use-gain'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    describe('POST', () => {
      const mockDevConsentData = [
        {
          location: 'mockUserId/mockUploadType/mockFilename'
        }
      ]
      const baseConfig = {
        uploadType: 'developer-upload-consent',
        url,
        formName: UPLOAD_CONSENT_FORM_ELEMENT_NAME,
        eventData: mockDevConsentData,
        containerName: 'customer-uploads'
      }

      beforeEach(async () => {
        await recreateContainers()
      })

      it('should upload a valid written consent to allocate off-site gains file to cloud storage', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.filePath = `${mockDataPath}/sample.docx`
            config.hasError = false
            config.headers = {
              referer: 'http://localhost:3000/developer/upload-consent-to-allocate-gains'
            }
            const response = await uploadFile(config)
            expect(response.statusCode).toEqual(302)
            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it('should display expected error details when an unsupported written consent to allocate off-site gains file type is uploaded', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.filePath = `${mockDataPath}/invalid.txt`
            config.hasError = true
            const response = await uploadFile(config)
            expect(response.payload).toContain('There is a problem')
            expect(response.payload).toContain('The selected file must be a DOC, DOCX or PDF')
            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it('should display expected error details when a written consent to allocate off-site gains file upload fails due to a timeout', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.filePath = `${mockDataPath}/sample.docx`
            config.generateUploadTimeoutError = true
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

      it('should not upload a written consent to allocate off-site gains file file more than 50 MB', (done) => {
        jest.isolateModules(async () => {
          try {
            const uploadConfig = Object.assign({}, baseConfig)
            uploadConfig.hasError = true
            uploadConfig.filePath = `${mockDataPath}/big-file.doc`
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

      it('should display an error message when no file data is uploaded', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.hasError = true
            const response = await uploadFile(config)
            expect(response.payload).toContain('There is a problem')
            expect(response.payload).toContain('Select a written consent')
            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it('should display an error when an empty written consent to allocate off-site gains file is uploaded', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.filePath = `${mockDataPath}/empty-file.doc`
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

      it('should display an error when threat detected error', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.filePath = `${mockDataPath}/sample.docx`
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

      it('should display an error when threat screening error', (done) => {
        jest.isolateModules(async () => {
          try {
            const config = Object.assign({}, baseConfig)
            config.filePath = `${mockDataPath}/sample.docx`
            config.generateThreatScreeningFailure = true
            config.hasError = true
            const response = await uploadFile(config)
            expect(response.payload).toContain('There is a problem')
            expect(response.payload).toContain(constants.uploadErrors.malwareScanFailed)
            setImmediate(() => {
              done()
            })
          } catch (err) {
            done(err)
          }
        })
      })

      it('should handle failAction post route', async () => {
        const expectedStatusCode = 415
        const res = await submitPostRequest({ url, payload: { parse: true } }, expectedStatusCode)
        expect(res.statusCode).toEqual(expectedStatusCode)
      })
    })
  })
})
