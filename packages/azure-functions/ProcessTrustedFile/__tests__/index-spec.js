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

const mockDataPath = 'packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/mock-data.xlsx'
const mockDownloadStreamIfExists = async (config, context) => {
  const readStream = fs.createReadStream(mockDataPath)
  const readableStream = Readable.from(readStream)
  return readableStream
}

describe('Trusted file processing', () => {
  it('should process a known geospatial upload type in a compressed file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(ZIP_FILE_EXTENSION, done)
  })

  it('should process a pdf upload for a legal agreement upload type. ', done => {
    performValidProcessingTest(PDF_FILE_EXTENSION, 'legal-agreement', done)
  })

  it('should process a pdf upload for a management plan upload type. ', done => {
    performValidProcessingTest(PDF_FILE_EXTENSION, 'management-plan', done)
  })

  it('should process a GeoJSON file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(GEOJSON_FILE_EXTENSION, done)
  })

  it('should process a Geopackage file.', done => {
    performValidGeospatialLandBoundaryProcessingTest(GEOPACKAGE_FILE_EXTENSION, done)
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

  it('should process a known developert metric file. ', done => {
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
})

describe('Processing developer metric extraction', () => {
  beforeEach(async () => {
    await recreateContainers()
  })

  it('should extract metric file data', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()

        blobStorageConnector.downloadToBufferIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)

        await processTrustedFile(context, {
          uploadType: DEVELOPER_METRIC_UPLOAD_TYPE,
          location: 'mock-session-id/mock-data.xlsx',
          containerName: 'trusted'
        })
        await expect(blobStorageConnector.downloadToBufferIfExists).toHaveBeenCalled()
        await expect(context.bindings.signalRMessages).toBeDefined()
        await expect(context.bindings.signalRMessages[0].arguments[0].metricData).toBeDefined()
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should throw exception if not extracted data', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()

        await processTrustedFile(context, {
          uploadType: DEVELOPER_METRIC_UPLOAD_TYPE,
          location: 'mock-session-id/mock-data.xlsx',
          containerName: 'unknown'
        })

        await expect(context.bindings.signalRMessages).toBeDefined()
        await expect(context.bindings.signalRMessages[0].arguments[0].errorCode).toBe('BUFFER-NOT-EXISTS')
        done()
      } catch (e) {
        done(e)
      }
    })
  })
})

const buildConfig = (fileExtension, uploadType) => {
  const userId = 'mock-session-id'
  const filenameRoot = 'mock-data'
  const fileDirectory = `${userId}/mockUploadType`
  const filename = `${filenameRoot}${fileExtension}`
  const outputFileLocation = uploadType.indexOf('.') > 0 ? `${fileDirectory}/${filenameRoot}` : `${fileDirectory}/${filenameRoot}.geojson`

  const mapConfig = {
    centroid: 'mock centroid',
    epsg: 'mock authority key',
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

const performValidGeospatialLandBoundaryProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const context = getContext()
      jest.mock('@defra/bng-geoprocessing-service')
      jest.mock('@defra/bng-connectors-lib')
      const testConfig = buildConfig(fileExtension, 'geospatial-land-boundary')
      const geoprocessingService = await import('@defra/bng-geoprocessing-service')
      const { blobStorageConnector } = await import('@defra/bng-connectors-lib')
      geoprocessingService.processLandBoundary = jest.fn().mockImplementation(async (logger, config) => {
        return testConfig.mapConfig
      })

      const spy = jest.spyOn(blobStorageConnector, 'moveBlob')

      await processTrustedFile(context, testConfig.message)

      setImmediate(async () => {
        expect(context.bindings.signalRMessages).toStrictEqual([testConfig.expectedSignalRMessage])
        // GeoJSON uploads do not require converting to GeoJSON format. As such moveBlob should not be called in this scenario.
        expect(spy).toHaveBeenCalledTimes(fileExtension === GEOJSON_FILE_EXTENSION ? 0 : 1)
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
      const testConfig = buildConfig(config.fileExtension, 'geospatial-land-boundary')

      testConfig.expectedSignalRMessage.arguments = config.expectedSignalRMessageArguments

      const geoprocessingService = (await import('@defra/bng-geoprocessing-service'))

      geoprocessingService.processLandBoundary = jest.fn().mockImplementation(async (logger, processLandBundaryConfig) => {
        config.processLandBoundaryMockFunction(testConfig)
      })

      await processTrustedFile(getContext(), testConfig.message)

      setImmediate(async () => {
        expect(getContext().bindings.signalRMessages).toStrictEqual([testConfig.expectedSignalRMessage])
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
