import { submitGetRequest, uploadFile } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants.js'
const HABITAT_PLAN_FORM_ELEMENT_NAME = 'habitatPlan'
const url = constants.routes.UPLOAD_HABITAT_PLAN

const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/habitat-plan'

describe('Habitat Plan upload controller tests', () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const baseConfig = {
      uploadType: 'habitat-plan',
      url,
      formName: HABITAT_PLAN_FORM_ELEMENT_NAME
    }

    beforeEach(async () => {
      await recreateContainers()
    })

    it('should upload habitat plan document to cloud storage and delete previous upload', (done) => {
      jest.isolateModules(async () => {
        try {
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.headers = {
            referer: `http://localhost:3000${url}`
          }
          uploadConfig.hasError = false
          uploadConfig.filePath = `${mockDataPath}/habitat-plan.pdf`
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

    it('should upload habitat plan document less than 50MB', (done) => {
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

    it('should not upload habitat plan document more than 50MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.pdf`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload habitat plan document larger than the configured maximum', (done) => {
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

    it('should not upload empty habitat plan', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/empty-habitat-plan.pdf`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload unsupported habitat plan type', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
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

    it('should not upload no file habitat plan', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
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

    it('should upload habitat plan document 50 MB file', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-habitat-plan-file'
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

    it('should upload habitat plan document 49 MB file when coming from a referer', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/49MB.pdf`
          uploadConfig.headers = {
            referer: 'http://localhost:30000/land/check-habitat-plan-file'
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
