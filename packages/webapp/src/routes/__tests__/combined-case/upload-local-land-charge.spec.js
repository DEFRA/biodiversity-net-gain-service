import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const LOCAL_LAND_CHARGE_FORM_ELEMENT_NAME = 'localLandCharge'
const url = constants.reusedRoutes.COMBINED_CASE_UPLOAD_LOCAL_LAND_CHARGE

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/local-land-charge'

describe('Local Land Charge upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const mockLocalLandCharge = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        mapConfig: {}
      }
    ]
    const baseConfig = {
      uploadType: 'local-land-charge',
      url,
      formName: LOCAL_LAND_CHARGE_FORM_ELEMENT_NAME,
      eventData: mockLocalLandCharge
    }

    beforeEach(async () => {
      await recreateContainers()
    })

    it('should upload local land charge document to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/local-land-charge.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          baseConfig.referer = `'http://localhost:30000${url}`
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

    it('should upload local land charge document to cloud storage with referer', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/local-land-charge.pdf`
          baseConfig.headers = {
            referer: `'http://localhost:30000${url}`
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

    it('should upload local land charge document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          baseConfig.referer = `'http://localhost:30000${url}`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/combined-case/check-local-land-charge-file'
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

    it('should not upload local charge document more than 50MB', (done) => {
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

    it('should not upload local land charge document larger than the configured maximum', (done) => {
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

    it('should not upload empty local charge', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-local-land-charge.pdf`
          baseConfig.referer = `'http://localhost:30000${url}`
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

    it('should not upload unsupported local land charge type', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          baseConfig.referer = `'http://localhost:30000${url}`
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

    it('should not upload nofile local land charge', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          baseConfig.referer = `'http://localhost:30000${url}`
          uploadConfig.hasError = true
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
          }
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('Select a local land charge search certificate file')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload local land charge document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/combined-case/check-local-land-charge-file'
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

    it('should upload local land charge document 49 MB file when coming from a referer', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/combined-case/check-local-land-charge-file'
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
