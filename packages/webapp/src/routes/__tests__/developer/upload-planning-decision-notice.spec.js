import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants.js'
const FORM_ELEMENT_NAME = 'planningDecisionNotice'
const url = constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/planning-decision-notice'

describe('Uplocad Planning Decision Notice tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view `, async () => {
      await submitGetRequest({ url }, 200)
    })
  })

  describe('POST', () => {
    const baseConfig = {
      uploadType: 'planning-decision-notice',
      url,
      formName: FORM_ELEMENT_NAME
    }

    beforeEach(async () => {
      await recreateContainers()
      jest.clearAllMocks()
    })

    it('should upload planning desicion notice file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.headers = {
            referer: 'http://localhost:30000/developer/check-planning-decision-notice-file'
          }
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/planning-decision-notice.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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

    it('should upload planning desicion notice file document less than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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

    it('should not upload  planning desicion notice file document more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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

    it('should not upload planning desicion notice file document larger than the configured maximum', (done) => {
      jest.isolateModules(async () => {
        try {
          process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB = 49
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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

    it('should not upload empty planning desicion notice file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-planning-decision-notice.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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

    it('should not upload unsupported planning desicion notice file document', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/wrong-extension.txt`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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

    it('should not upload nofile planning desicion notice file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
          }
          await uploadFile(uploadConfig, 200)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should  upload planning desicion notice file 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.sessionData = {
            [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.ALLOCATION
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
