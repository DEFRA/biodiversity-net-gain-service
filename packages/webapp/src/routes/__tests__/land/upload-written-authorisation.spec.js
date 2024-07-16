import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
import * as azureStorage from '../../../utils/azure-storage.js'
const FORM_ELEMENT_NAME = 'writtenAuthorisation'
const url = constants.routes.UPLOAD_WRITTEN_AUTHORISATION

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/written-authorisation'
const sessionData = {}

describe('Proof of ownership upload controller tests', () => {
  beforeAll(async () => {
    sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const baseConfig = {
      uploadType: 'written-authorisation',
      url,
      formName: FORM_ELEMENT_NAME
    }

    beforeEach(async () => {
      await recreateContainers()
    })

    it('should upload written authorisation document to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-written-authorisation-file'
          }
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/written-authorisation.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          await uploadFile(uploadConfig)
          expect(spy).toHaveBeenCalledTimes(1)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload written authorisation document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
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

    it('should not upload written authorisation document more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.pdf`
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

    it('should not upload written authorisation document larger than the configured maximum', (done) => {
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

    it('should not upload empty written authorisation', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-written-authorisation.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
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

    it('should not upload unsupported written authorisation document', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
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

    it('should not upload nofile written authorisation file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          const res = await uploadFile(uploadConfig, 200)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('Select the written authorisation file')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload file with xss velnerability', (done) => {
      const mockDataPathGeneric = 'packages/webapp/src/__mock-data__/uploads/generic-files'
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPathGeneric}/<a onmouseover=alert(document.cookie)>resillion.doc`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should  upload written authorisation document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
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
