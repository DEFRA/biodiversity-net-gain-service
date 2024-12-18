import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
const LEGAL_AGREEMENT_FORM_ELEMENT_NAME = 'legalAgreement'
const url = constants.routes.UPLOAD_LEGAL_AGREEMENT

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe('Legal agreement upload controller tests', () => {
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
    })

    it('should upload legal agreement document to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/legal-agreement.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          baseConfig.referer = `'http://localhost:30000${url}`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload legal agreement document to cloud storage with referer', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/legal-agreement.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          baseConfig.headers = {
            referer: `'http://localhost:30000${url}`
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

    it('should upload legal agreement document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          baseConfig.referer = `'http://localhost:30000${url}`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-legal-agreement-details'
          }
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
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

    it('should not upload legal agreement document more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.pdf`
          baseConfig.referer = `'http://localhost:30000${url}`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
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

    it('should not upload legal agreement document larger than the configured maximum', (done) => {
      jest.isolateModules(async () => {
        try {
          process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB = 49
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(`The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB}MB`)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload empty legal agreement', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-legal-agreement.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          baseConfig.referer = `'http://localhost:30000${url}`
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

    it('should not upload unsupported legal agreement', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          baseConfig.referer = `'http://localhost:30000${url}`
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('The selected file must be a DOC, DOCX or PDF')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload nofile legal agreement', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          baseConfig.referer = `'http://localhost:30000${url}`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          uploadConfig.hasError = true
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('Select a legal agreement')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload legal agreement document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-legal-agreement-details'
          }
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
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

    it('should upload legal agreement document 49 MB file when coming from a referer', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-legal-agreement-details'
          }
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
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
  })
})
