import { startServer, uploadFile } from './helpers/server.js'
import serverOptions from '../../__mocks__/server-options.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'

const GEOSPATIAL_LAND_BOUNDARY_FORM_ELEMENT_NAME = 'geospatialLandBoundary'
const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/geospatial-land-boundaries'
const url = '/upload-geospatial-land-boundary'
let server

jest.mock('../../utils/azure-signalr.js')

describe(url, () => {
  beforeAll(async () => {
    await recreateQueues()
  })

  beforeEach(async () => {
    server = await startServer(serverOptions)
    await recreateContainers()
    await clearQueues()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  it('should upload a Geopackage to cloud storage', (done) => {
    jest.isolateModules(async () => {
      const mockLandBoundary = [
        {
          location: {},
          mapConfig: {}
        }
      ]
      const config = {
        server,
        url,
        formName: GEOSPATIAL_LAND_BOUNDARY_FORM_ELEMENT_NAME,
        filePath: `${mockDataPath}/geopackage-land-boundary-4326.gpkg`,
        eventData: mockLandBoundary
      }
      await uploadFile(config)
      setImmediate(() => {
        done()
      })
    })
  })
})
