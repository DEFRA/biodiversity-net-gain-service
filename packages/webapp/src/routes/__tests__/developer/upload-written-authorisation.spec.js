import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
const FORM_ELEMENT_NAME = 'writtenAuthorisation'
const url = constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/written-authorisation'

describe('Proof of ownership upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for a landowner or agent with a client who is a landowner`, async () => {
      await submitGetRequest({ url }, 200, { 'developer-is-agent': 'no' })
    })

    it(`should render the ${url.substring(1)} view for an agent with a client who is not a landowner `, async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.DEVELOPER_IS_AGENT] = constants.APPLICANT_IS_AGENT.YES
      sessionData[constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER] = constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('Proof of permission 1 of 2')
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
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.headers = {
            referer: 'http://localhost:30000/developer/check-written-authorisation-file'
          }
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/written-authorisation.pdf`
          await uploadFile(uploadConfig)
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

    it('should not upload no file written authorisation file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
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

    it('should not upload file with xss vulnerability', (done) => {
      const mockDataPathGeneric = 'packages/webapp/src/__mock-data__/uploads/generic-files'
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPathGeneric}/<a onmouseover=alert(document.cookie)>resillion.doc`
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

    it('should upload written authorisation document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
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
