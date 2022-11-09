import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'

const GEOSPATIAL_LAND_BOUNDARY_FORM_ELEMENT_NAME = 'geospatialLandBoundary'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/geospatial-land-boundaries'
const url = '/land/upload-geospatial-file'

jest.mock('../../../utils/azure-signalr.js')

describe(url, () => {
  beforeAll(async () => {
    await recreateQueues()
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    const mockLandBoundary = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        mapConfig: {}
      }
    ]
    const baseConfig = {
      uploadType: 'geospatial-land-boundary',
      url,
      formName: GEOSPATIAL_LAND_BOUNDARY_FORM_ELEMENT_NAME,
      eventData: mockLandBoundary
    }

    beforeEach(async () => {
      await recreateContainers()
      await clearQueues()
    })

    it('should upload a Geopackage to cloud storage', (done) => {
      jest.isolateModules(async () => {
        const uploadConfig = Object.assign({}, baseConfig)
        uploadConfig.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
        uploadConfig.headers = {
          referer: 'http://localhost:30000/land/check-land-boundary-details'
        }
        await uploadFile(uploadConfig)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should cause an internal server error when file upload processing fails', (done) => {
      jest.isolateModules(async () => {
        const config = Object.assign({}, baseConfig)
        config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
        config.generateFormDataError = true
        await uploadFile(config)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should cause an internal server error response when upload notification processing fails', (done) => {
      jest.isolateModules(async () => {
        const config = Object.assign({}, baseConfig)
        config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
        config.generateHandleEventsError = true
        await uploadFile(config)
        setImmediate(() => {
          done()
        })
      })
    })

    it('should cause an internal server error when non-file data is uploaded', (done) => {
      jest.isolateModules(async () => {
        const config = Object.assign({}, baseConfig)
        await uploadFile(config)
        setImmediate(() => {
          done()
        })
      })
    })
  })
})
