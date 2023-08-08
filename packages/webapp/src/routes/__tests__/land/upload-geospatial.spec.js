import { submitGetRequest, uploadFile } from '../helpers/server.js'
import { clearQueues, recreateContainers, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import constants from '../../../utils/constants'
import * as azureStorage from '../../../utils/azure-storage.js'

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
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
  })

  describe('POST', () => {
    const mockLandBoundary = [
      {
        location: 'mockUserId/mockUploadType/mockFilename',
        mapConfig: {
          hectares: 2,
          gridRef: 'ST123456'
        }
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
          jest.mock('../../../utils/azure-storage.js')
          const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
          const config = JSON.parse(JSON.stringify(baseConfig))
          config.eventData[0].reprojectedLocation = 'mockUserId/mockUploadType/reprojectedToOsgb36/mockFilename'
          config.eventData[0].reprojectedFileSize = 500
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.headers = {
            referer: 'http://localhost:3000/land/check-land-boundary-details'
          }
          const res = await uploadFile(config)
          expect(res.headers.location).toBe(constants.routes.CHECK_GEOSPATIAL_FILE)
          expect(spy).toHaveBeenCalledTimes(1)
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should upload a 1MB GeoJSON file to cloud storage', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = JSON.parse(JSON.stringify(baseConfig))
          uploadConfig.filePath = `${mockDataPath}/1MB.geojson`
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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

    it('should display expected error details when an upload crosses English borders', (done) => {
      jest.isolateModules(async () => {
        try {
          const config = JSON.parse(JSON.stringify(baseConfig))
          config.filePath = `${mockDataPath}/geopackage-land-boundary-4326.gpkg`
          config.generateOutsideEnglandError = true
          config.hasError = true
          const response = await uploadFile(config)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('Entire land boundary must be in England')
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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

    it('should not upload a geospatial land boundary document more than 1MB', (done) => {
      jest.isolateModules(async () => {
        try {
          const uploadConfig = JSON.parse(JSON.stringify(baseConfig))
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/55MB.geojson`
          const response = await uploadFile(uploadConfig)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('The selected file must not be larger than 1MB')
          setImmediate(() => {
            done()
          })
        } catch (err) {
          done(err)
        }
      })
    })

    it('should not upload a geospatial land boundary larger than the configured maximum', (done) => {
      jest.isolateModules(async () => {
        try {
          process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB = 0.9
          const uploadConfig = Object.assign({}, baseConfig)
          uploadConfig.hasError = true
          uploadConfig.filePath = `${mockDataPath}/1MB.geojson`
          const res = await uploadFile(uploadConfig)
          expect(res.payload).toContain('There is a problem')
          expect(res.payload).toContain(`The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_FILE_UPLOAD_MB}MB`)
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
          const config = JSON.parse(JSON.stringify(baseConfig))
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
