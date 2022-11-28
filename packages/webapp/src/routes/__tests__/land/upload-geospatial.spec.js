import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'

const GEOSPATIAL_LAND_BOUNDARY_FORM_ELEMENT_NAME = 'geospatialLandBoundary'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/geospatial-land-boundaries'
const url = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY

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

    it('should upload a valid Geopackage to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.headers = {
            referer: 'http://localhost:3000/land/check-land-boundary-details'
          }
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload a 50MB GeoJSON file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.filePath = `${mockDataPath}/50MB.geojson`
          await uploadFile(uploadConfig)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should cause an internal server error when file upload processing fails', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateFormDataError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should cause an internal server error response when upload notification processing fails for an unexpected reason', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateHandleEventsError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an upload uses an invalid Coordinate Reference System', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateInvalidCoordinateReferenceSystemError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must use either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an upload does not specify a Coordinate Reference System', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateMissingCoordinateReferenceSystemError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must specify use of either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an upload does not contain a single geospatial layer', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateInvalidLayerCountError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must only contain one layer')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an upload contains a single geospatial layer with multiple features', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateInvalidFeatureCountError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must only contain one polygon')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an unsupported file type is uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/unsupported-file-format.json`
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must be a GeoJSON, Geopackage or Shape file')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an empty file is uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/empty-geopackage.gpkg`
          config.generateInvalidFeatureCountError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file is empty')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when upload screening detects a threat', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateThreatDetectedError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain(constants.uploadErrors.threatDetected)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when upload screening fails', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateThreatScreeningFailure = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain(constants.uploadErrors.uploadFailure)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when an upload fails due to a timeout', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateUploadTimeoutError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain(constants.uploadErrors.uploadFailure)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload a geospatial land boundary document more than 50 MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.geojson`
          const response = await uploadFile(uploadConfig)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must not be larger than 50MB')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should display expected error details when non-file data is uploaded', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('Select a file showing the land boundary')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should cause an internal server error when an unexpected validation error code is received', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateUnexpectedValidationError = true
          await uploadFile(config)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload an invalid GeoJSON file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = Object.assign({}, baseConfig)
          config.filePath = `${mockDataPath}/invalid-file-content.geojson`
          config.generateInvalidUploadError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must be a GeoJSON, Geopackage or Shape file')
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
