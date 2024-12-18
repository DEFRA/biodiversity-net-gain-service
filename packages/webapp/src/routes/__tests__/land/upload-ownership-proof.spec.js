import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
const PROOF_OF_OWNERSHIP_FORM_ELEMENT_NAME = 'landOwnership'
const url = constants.routes.UPLOAD_LAND_OWNERSHIP

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe('Proof of ownership upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const baseConfig = {
      uploadType: 'land-ownership',
      url,
      formName: PROOF_OF_OWNERSHIP_FORM_ELEMENT_NAME,
      sessionData: {
        [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
      }
    }

    beforeEach(async () => {
      await recreateContainers()
    })

    afterEach(() => {
      baseConfig.sessionData = {
        [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION
      }
    })

    it('should upload land ownership document to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/ownership-proof-list'
          }
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/legal-agreement.pdf`
          uploadConfig.sessionData[`${constants.redisKeys.LAND_OWNERSHIP_PROOFS}`] = [{
            fileName: 'legal-agreement.pdf',
            fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/legal-agreement.pdf',
            fileSize: 0.01,
            fileType: 'application/pdf',
            id: '1'
          }]
          uploadConfig.sessionData[`${constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF}`] = [{
            fileName: 'file-1.doc',
            fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
            fileSize: 0.01,
            fileType: 'application/msword',
            id: '1',
            confirmed: false
          }]
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload land ownership document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload land ownership document more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.pdf`
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

    it('should not upload land ownership document larger than the configured maximum', (done) => {
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

    it('should not upload empty land ownership', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-legal-agreement.pdf`
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

    it('should not upload unsupported land ownership document', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
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

    it('should not upload nofile land ownership file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          const res = await uploadFile(uploadConfig, 200)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain('Select a proof of land ownership file')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload land ownership document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          await uploadFile(uploadConfig, 200)
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
