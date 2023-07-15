import processTrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'
import { Readable } from 'stream'
import { recreateContainers } from '@defra/bng-azure-storage-test-utils'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import fs from 'fs'
jest.mock('@defra/bng-connectors-lib')

const GEOJSON_FILE_EXTENSION = '.geojson'
const GEOPACKAGE_FILE_EXTENSION = '.gpkg'
const ZIP_FILE_EXTENSION = '.zip'
const PDF_FILE_EXTENSION = '.pdf'
const METRIC_FILE_EXTENSION = '.xlsx'
const DEVELOPER_METRIC_UPLOAD_TYPE = 'developer-upload-metric'
const LOJ_METRIC_UPLOAD_TYPE = 'metric-upload'
const REPROJECTED_TO_OSGB36 = 'reprojectedToOsgb36'
const CONSENT_AGREEMENT = 'developer-upload-consent'

const mockDataPath = 'packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/mock-data.xlsx'
const mockDownloadStreamIfExists = async (config, context) => {
  const readStream = fs.createReadStream(mockDataPath)
  const readableStream = Readable.from(readStream)
  return {
    readableStreamBody: readableStream
  }
}

describe('Trusted file processing', () => {
  it('should process a known WGS84 geospatial upload type in a compressed file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(ZIP_FILE_EXTENSION, '4326', done)
  })

  it('should process a known OSGB36 geospatial upload type in a compressed file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(ZIP_FILE_EXTENSION, '27700', done)
  })

  it('should process a pdf upload for a legal agreement upload type. ', done => {
    performValidProcessingTest(PDF_FILE_EXTENSION, 'legal-agreement', done)
  })
  it('should process a pdf upload for a local search upload type. ', done => {
    performValidProcessingTest(PDF_FILE_EXTENSION, 'local-and-search', done)
  })
  it('should process a pdf upload for a management plan upload type. ', done => {
    performValidProcessingTest(PDF_FILE_EXTENSION, 'management-plan', done)
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

  it('should process a known land boundary file.', done => {
    performValidLandBoundaryDocumentProcessingTest(PDF_FILE_EXTENSION, done)
  })

  it('should process a known land ownership file.', done => {
    performValidLandOwnershipDocumentProcessingTest(PDF_FILE_EXTENSION, done)
  })

  it('should process a known metric file.', done => {
    performValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should process a known developer metric file. ', done => {
    performDeveloperValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should respond to a coordinate reference system validation error. ', done => {
    const config = {
      expectedSignalRMessageArguments: [{
        authorityKey: 'mock authority key',
        errorCode: 'mock error code'
      }],
      fileExtension: GEOPACKAGE_FILE_EXTENSION,
      processLandBoundaryMockFunction: throwCoordinateSystemValidationError
    }
    performInvalidGeospatialLandBoundaryProcessingTest(config, done)
  })

  it('should respond to a validation error. ', done => {
    const config = {
      expectedSignalRMessageArguments: [{
        errorCode: 'mock error code'
      }],
      fileExtension: GEOPACKAGE_FILE_EXTENSION,
      processLandBoundaryMockFunction: throwValidationError
    }
    performInvalidGeospatialLandBoundaryProcessingTest(config, done)
  })

  it('should respond to an error. ', done => {
    const config = {
      expectedSignalRMessageArguments: [{
        errorMessage: 'mock error message'
      }],
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
        const expectedSignalRMessage = {
          userId,
          target: `Processed ${filename}`,
          arguments: [{
            code: 'UNKNOWN-UPLOAD-TYPE',
            uploadType
          }]
        }
        const message = {
          uploadType,
          location: `${userId}/mockUploadType/${filename}`
        }

        await processTrustedFile(getContext(), message)

        setImmediate(async () => {
          await expect(getContext().bindings.signalRMessages).toStrictEqual([expectedSignalRMessage])
          done()
        })
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
          uploadType: LOJ_METRIC_UPLOAD_TYPE,
          location: 'test',
          containerName: 'test'
        })
        await expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        await expect(context.bindings.signalRMessages).toBeDefined()
        await expect(context.bindings.signalRMessages[0].arguments[0].metricData).toBeDefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})

describe('Processing developer consent', () => {
  beforeEach(async () => {
    await recreateContainers()
  })

  it('should extract consent file data', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()

        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)

        await processTrustedFile(context, {
          uploadType: CONSENT_AGREEMENT,
          location: 'mock-session-id/mock-data.xlsx',
          containerName: 'trusted'
        })
        await expect(context.bindings.signalRMessages[0].arguments[0].location).toBeDefined()
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should throw error if unable to retreive blob', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()

        await processTrustedFile(context, {
          uploadType: DEVELOPER_METRIC_UPLOAD_TYPE,
          location: 'mock-session-id/mock-data.xlsx',
          containerName: 'unknown'
        })

        await expect(context.bindings.signalRMessages).toBeDefined()
        await expect(context.bindings.signalRMessages[0].arguments[0].location).toBeUndefined()
        done()
      } catch (e) {
        done(e)
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
    message: {
      uploadType,
      location: `${fileDirectory}/${filename}`,
      containerName: 'trusted'
    },
    expectedSignalRMessage: {
      userId,
      target: `Processed ${filename}`,
      arguments: [{
        location: outputFileLocation
      }]
    }
  }

  if (epsg !== '27700') {
    config.expectedSignalRMessage.arguments[0].reprojectedLocation = reprojectedOutputFileLocation
    config.expectedSignalRMessage.arguments[0].reprojectedFileSize = reprojectedOutputFileSize
  }

  switch (uploadType) {
    case DEVELOPER_METRIC_UPLOAD_TYPE:
      config.metricData = metricData
      config.expectedSignalRMessage.arguments[0].metricData = metricData
      break

    default:
      config.mapConfig = mapConfig
      config.expectedSignalRMessage.arguments[0].mapConfig = mapConfig
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

      await processTrustedFile(context, testConfig.message)

      setImmediate(async () => {
        expect(context.bindings.signalRMessages).toStrictEqual([testConfig.expectedSignalRMessage])
        expect(spy).toHaveBeenCalledTimes(expectedNumberOfMoveBlobCalls)
        done()
      })
    } catch (e) {
      done(e)
    }
  })
}

const performValidProcessingTest = (fileExtension, uploadType, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, uploadType)

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages[0].target).toEqual(testConfig.expectedSignalRMessage.target)
        done()
      })
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
      testConfig.expectedSignalRMessage.arguments = config.expectedSignalRMessageArguments

      const geoprocessingService = (await import('@defra/bng-geoprocessing-service'))

      geoprocessingService.processLandBoundary = jest.fn().mockImplementation(async (logger, processLandBundaryConfig) => {
        config.processLandBoundaryMockFunction(testConfig)
      })

      const spy = jest.spyOn(blobStorageConnector, 'deleteBlobIfExists')

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages).toStrictEqual([testConfig.expectedSignalRMessage])
        expect(spy).toHaveBeenCalledTimes(2)
        done()
      })
    } catch (e) {
      done(e)
    }
  })
}

const performValidLandBoundaryDocumentProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'land-boundary')

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages[0].target).toEqual(testConfig.expectedSignalRMessage.target)
        done()
      })
    } catch (e) {
      done(e)
    }
  })
}

const performValidLandOwnershipDocumentProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'land-ownership')

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages[0].target).toEqual(testConfig.expectedSignalRMessage.target)
        done()
      })
    } catch (e) {
      done(e)
    }
  })
}

const performValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'metric-upload')

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages[0].target).toEqual(testConfig.expectedSignalRMessage.target)
        done()
      })
    } catch (e) {
      done(e)
    }
  })
}

const throwCoordinateSystemValidationError = testConfig => {
  const authorityKey = testConfig.expectedSignalRMessage.arguments[0].authorityKey
  const errorCode = testConfig.expectedSignalRMessage.arguments[0].errorCode
  throw new CoordinateSystemValidationError(authorityKey, errorCode)
}

const throwValidationError = testConfig => {
  const errorCode = testConfig.expectedSignalRMessage.arguments[0].errorCode
  throw new ValidationError(errorCode)
}

const throwError = testConfig => {
  const errorMessage = testConfig.expectedSignalRMessage.arguments[0].errorMessage
  throw new Error(errorMessage)
}

const performDeveloperValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'developer-upload-metric')

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages[0].target).toEqual(testConfig.expectedSignalRMessage.target)
        done()
      })
    } catch (e) {
      done(e)
    }
  })
}
