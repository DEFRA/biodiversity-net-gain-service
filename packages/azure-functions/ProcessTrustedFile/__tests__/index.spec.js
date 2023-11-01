import processTrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'
import { Readable } from 'stream'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import fs from 'fs'
jest.mock('@defra/bng-connectors-lib')

const GEOJSON_FILE_EXTENSION = '.geojson'
const GEOPACKAGE_FILE_EXTENSION = '.gpkg'
const ZIP_FILE_EXTENSION = '.zip'
const METRIC_FILE_EXTENSION = '.xlsx'
const DEVELOPER_METRIC_UPLOAD_TYPE = 'developer-metric-upload'
const LOJ_METRIC_UPLOAD_TYPE = 'metric-upload'
const REPROJECTED_TO_OSGB36 = 'reprojectedToOsgb36'

describe('Trusted file processing', () => {
  it('should process a known WGS84 geospatial upload type in a compressed file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(ZIP_FILE_EXTENSION, '4326', done)
  })

  it('should process a known OSGB36 geospatial upload type in a compressed file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(ZIP_FILE_EXTENSION, '27700', done)
  })

  it('should process a WGS84 GeoJSON file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(GEOJSON_FILE_EXTENSION, '4326', done)
  })

  it('should process an OSGB36 GeoJSON file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(GEOJSON_FILE_EXTENSION, '27700', done)
  })

  it('should process a WGS84 Geopackage file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(GEOPACKAGE_FILE_EXTENSION, '4326', done)
  })

  it('should process an OSGB36 Geopackage file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(GEOPACKAGE_FILE_EXTENSION, '27700', done)
  })

  it('should process a known metric file.', done => {
    performValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should process a known developer metric file. ', done => {
    performDeveloperValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should respond to a coordinate reference system validation error. ', done => {
    const config = {
      expectedRes: {
        authorityKey: 'mock authority key',
        errorCode: 'mock error code'
      },
      fileExtension: GEOPACKAGE_FILE_EXTENSION,
      processLandBoundaryMockFunction: throwCoordinateSystemValidationError
    }
    performInvalidGeospatialLandBoundaryProcessingTest(config, done)
  })

  it('should respond to a validation error. ', done => {
    const config = {
      expectedRes: {
        errorCode: 'mock error code'
      },
      fileExtension: GEOPACKAGE_FILE_EXTENSION,
      processLandBoundaryMockFunction: throwValidationError
    }
    performInvalidGeospatialLandBoundaryProcessingTest(config, done)
  })

  it('should respond to an error. ', done => {
    const config = {
      expectedRes: {
        errorMessage: 'mock error message'
      },
      fileExtension: GEOPACKAGE_FILE_EXTENSION,
      processLandBoundaryMockFunction: throwError
    }
    performInvalidGeospatialLandBoundaryProcessingTest(config, done)
  })

  it('should not process an unsupported file type.', done => {
    jest.isolateModules(async () => {
      try {
        const filename = 'mock-data.json'
        const userId = 'mockSessionId'
        const uploadType = 'unknown-upload-type'
        const expectedRes = {
          status: 400,
          body: {
            code: 'UNKNOWN-UPLOAD-TYPE',
            uploadType
          }
        }
        const req = {
          body: {
            uploadType,
            location: `${userId}/mockUploadType/${filename}`
          }
        }

        await processTrustedFile(getContext(), req)
        expect(getContext().res.status).toEqual(400)
        expect(getContext().res.body).toStrictEqual(expectedRes.body)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('Should process a trusted LOJ metric file', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
          const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
          const readableStream = Readable.from(readStream)
          return {
            readableStreamBody: readableStream
          }
        })
        await processTrustedFile(context, {
          body: {
            uploadType: LOJ_METRIC_UPLOAD_TYPE,
            location: 'test',
            containerName: 'test'
          }
        })
        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toBeDefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should process a trusted developer metric file', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
          const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
          const readableStream = Readable.from(readStream)
          return {
            readableStreamBody: readableStream
          }
        })
        await processTrustedFile(context, {
          body: {
            uploadType: DEVELOPER_METRIC_UPLOAD_TYPE,
            location: 'test',
            containerName: 'test'
          }
        })

        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toBeDefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})

const buildConfig = (fileExtension, uploadType, epsg) => {
  const userId = 'mock-session-id'
  const filenameRoot = 'mock-data'
  const fileDirectory = `${userId}/mockUploadType`
  const filename = `${filenameRoot}${fileExtension}`
  const outputFileLocation = uploadType.indexOf('.') > 0 ? `${fileDirectory}/${filenameRoot}` : `${fileDirectory}/${filenameRoot}.geojson`
  const reprojectedFileDirectory = `${fileDirectory}/${REPROJECTED_TO_OSGB36}`
  const reprojectedOutputFileLocation = uploadType.indexOf('.') > 0 ? `${reprojectedFileDirectory}/${filenameRoot}` : `${reprojectedFileDirectory}/${filenameRoot}.geojson`
  const reprojectedOutputFileSize = 500
  const mapConfig = {
    centroid: 'mock centroid',
    epsg: epsg || 'mock EPSG',
    extent: ['mock extent']
  }

  const metricData = {
    startPage: {
      projectName: 'mock project',
      projectAuthority: 'mock authority'
    }
  }

  const config = {
    req: {
      body: {
        uploadType,
        blobName: `${fileDirectory}/${filename}`,
        containerName: 'customer-uploads'
      }
    },
    expectedRes: {
      status: 200,
      body: {
        location: outputFileLocation,
        mapConfig
      }
    }
  }

  if (epsg !== '27700') {
    config.expectedRes.body.reprojectedLocation = reprojectedOutputFileLocation
    config.expectedRes.body.reprojectedFileSize = reprojectedOutputFileSize
  }

  switch (uploadType) {
    case DEVELOPER_METRIC_UPLOAD_TYPE:
      config.metricData = metricData
      break

    default:
      config.mapConfig = mapConfig
      break
  }

  return config
}

const performValidGeospatialLandBoundaryProcessingTest = (fileExtension, epsg, done) => {
  jest.isolateModules(async () => {
    try {
      const context = getContext()
      jest.mock('@defra/bng-geoprocessing-service')
      jest.mock('@defra/bng-connectors-lib')
      const testConfig = buildConfig(fileExtension, 'geospatial-land-boundary', epsg)
      const geoprocessingService = await import('@defra/bng-geoprocessing-service')
      const { blobStorageConnector } = await import('@defra/bng-connectors-lib')
      geoprocessingService.processLandBoundary = jest.fn().mockImplementation(async (logger, config) => {
        return testConfig.mapConfig
      })

      blobStorageConnector.getBlobSizeInBytes = jest.fn().mockImplementation(async config => {
        return 500
      })

      const spy = jest.spyOn(blobStorageConnector, 'moveBlob')
      let expectedNumberOfMoveBlobCalls

      if (epsg === '27700') {
        if (fileExtension === GEOJSON_FILE_EXTENSION) {
          // OSGB36 GeoJSON uploads do not require converting to GeoJSON format. As such moveBlob should not be called in this scenario.
          expectedNumberOfMoveBlobCalls = 0
        } else {
          // OSGB36 non-GeoJSON uploads need converting to GeoJSON. As such moveBlob should be called once in this scenario.
          expectedNumberOfMoveBlobCalls = 1
        }
      } else if (fileExtension === GEOJSON_FILE_EXTENSION) {
        // WGS84 GeoJSON uploads require reprojection to OSGB36. As such moveBlob should be called once in this scenario.
        expectedNumberOfMoveBlobCalls = 1
      } else {
        // WGS84 non-GeoJSON uploads require conversion to GeoJSON and reprojection to OSGB36. As such moveBlob should be called twice in this scenario.
        expectedNumberOfMoveBlobCalls = 2
      }

      await processTrustedFile(context, testConfig.req)
      expect(context.res.status).toEqual(200)
      expect(JSON.parse(context.res.body)).toEqual(testConfig.expectedRes.body)
      expect(spy).toHaveBeenCalledTimes(expectedNumberOfMoveBlobCalls)
      done()
    } catch (e) {
      done(e)
    }
  })
}

const performInvalidGeospatialLandBoundaryProcessingTest = (config, done) => {
  jest.isolateModules(async () => {
    try {
      jest.mock('@defra/bng-geoprocessing-service')
      jest.mock('@defra/bng-connectors-lib')
      const testConfig = buildConfig(config.fileExtension, 'geospatial-land-boundary')
      testConfig.expectedRes.body = config.expectedRes

      const geoprocessingService = (await import('@defra/bng-geoprocessing-service'))

      geoprocessingService.processLandBoundary = jest.fn().mockImplementation(async (logger, processLandBundaryConfig) => {
        config.processLandBoundaryMockFunction(testConfig)
      })

      const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')

      await processTrustedFile(getContext(), testConfig.req)
      const context = getContext()
      expect(context.res.status).toEqual(200)
      expect(JSON.parse(context.res.body)).toEqual(testConfig.expectedRes.body)
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    } catch (e) {
      done(e)
    }
  })
}

const performValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'metric-upload')
      blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
        const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
        const readableStream = Readable.from(readStream)
        return {
          readableStreamBody: readableStream
        }
      })
      await processTrustedFile(getContext(), testConfig.req)

      expect(getContext().res.status).toEqual(200)
      expect(JSON.parse(getContext().res.body)).toBeDefined()
      done()
    } catch (e) {
      done(e)
    }
  })
}

const throwCoordinateSystemValidationError = testConfig => {
  const authorityKey = testConfig.expectedRes.body.authorityKey
  const errorCode = testConfig.expectedRes.body.errorCode
  throw new CoordinateSystemValidationError(authorityKey, errorCode)
}

const throwValidationError = testConfig => {
  const errorCode = testConfig.expectedRes.body.errorCode
  throw new ValidationError(errorCode)
}

const throwError = testConfig => {
  const errorMessage = testConfig.expectedRes.body.errorMessage
  throw new Error(errorMessage)
}

const performDeveloperValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'developer-metric-upload')
      blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
        const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
        const readableStream = Readable.from(readStream)
        return {
          readableStreamBody: readableStream
        }
      })
      await processTrustedFile(getContext(), testConfig.req)

      expect(getContext().res.status).toEqual(200)
      expect(JSON.parse(getContext().res.body)).toBeDefined()
      done()
    } catch (e) {
      done(e)
    }
  })
}
