import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
const LEGAL_AGREEMENT_FORM_ELEMENT_NAME = 'legalAgreement'
const url = constants.routes.UPLOAD_LEGAL_AGREEMENT

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'
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
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/legal-agreement.pdf`
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
          await uploadFile(uploadConfig)
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

    it('should not upload unsupported legal agreement', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
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

    it('should not upload nofile legal agreement', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          baseConfig.referer = `'http://localhost:30000${url}`
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

    it('should  upload legal agreement document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-legal-agreement-details'
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

    it('should cause an internal server error response when notification processing fails', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/legal-agreement.pdf`
          baseConfig.referer = `'http://localhost:30000${url}`
          config.generateHandleEventsError = true
          config.hasError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should  upload legal agreement document 49 MB file when coming from a referer', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-legal-agreement-details'
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
