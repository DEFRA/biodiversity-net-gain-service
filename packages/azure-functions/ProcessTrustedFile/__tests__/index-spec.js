import processTrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { BlobBufferError, CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'
jest.mock('@defra/bng-connectors-lib')

const GEOJSON_FILE_EXTENSION = '.geojson'
const GEOPACKAGE_FILE_EXTENSION = '.gpkg'
const ZIP_FILE_EXTENSION = '.zip'
const PDF_FILE_EXTENSION = '.pdf'
const METRIC_FILE_EXTENSION = '.xlsx'
const DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE = 'developer-metric-extraction'

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

  it.skip('should extract developer metric data. ', done => {
    const config = {
      expectedSignalRMessageArguments: [{
        uploadType: 'developer-metric-extraction',
        location: '3f71693c-3b1b-448c-827c-0ee181d49929/metric-upload/metric-file.xlsx',
        containerName: 'trusted'
      }],
      fileExtension: METRIC_FILE_EXTENSION,
      processDeveloperMetricExtractionFunction: throwCoordinateSystemValidationError
    }
    performDeveloperMetricExtractionTest(config, done)
  })

  it('should respond while extacting metric data if blob not exists. ', done => {
    const config = {
      expectedSignalRMessageArguments: [{
        errorCode: 'BUFFER-NOT-EXISTS'
      }],
      fileExtension: METRIC_FILE_EXTENSION,
      processDeveloperMetricExtractionFunction: throwBlobNotExistsError
    }
    performDeveloperMetricExtractionFailedTest(config, done)
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

  let _config
  switch (uploadType) {
    case DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE:
      _config = {
        metricData,
        message: {
          uploadType,
          location: `${fileDirectory}/${filename}`,
          containerName: 'trusted'
        },
        expectedSignalRMessage: {
          userId,
          target: `Processed ${filename}`,
          arguments: [{
            location: outputFileLocation,
            metricData
          }]
        }
      }
      break

    default:
      _config = {
        mapConfig,
        message: {
          uploadType,
          location: `${fileDirectory}/${filename}`
        },
        expectedSignalRMessage: {
          userId,
          target: `Processed ${filename}`,
          arguments: [{
            location: outputFileLocation,
            mapConfig
          }]
        }
      }
      break
  }

  return _config
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

const throwBlobNotExistsError = testConfig => {
  const errorCode = testConfig.expectedSignalRMessage.arguments[0].errorCode
  throw new BlobBufferError(errorCode)
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

const performDeveloperMetricExtractionTest = (config, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(config.fileExtension, DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE)
      testConfig.expectedSignalRMessage.arguments = config.expectedSignalRMessageArguments

      await processTrustedFile(getContext(), testConfig.message)
      expect(getContext().bindings.signalRMessages).toStrictEqual([testConfig.expectedSignalRMessage])
      done()
    } catch (e) {
      done(e)
    }
  })
}
const performDeveloperMetricExtractionFailedTest = (config, done) => {
  jest.isolateModules(async () => {
    try {
      jest.mock('@defra/bng-metric-service')
      const testConfig = buildConfig(config.fileExtension, DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE)
      testConfig.expectedSignalRMessage.arguments = config.expectedSignalRMessageArguments
      testConfig.message.containerName = 'unknown'

      const BngExtractionService = await import('@defra/bng-metric-service')
      BngExtractionService.extractMetricContent = jest.fn().mockImplementation(async (logger, config) => {
        config.processDeveloperMetricExtractionFunction(testConfig)
      })

      await processTrustedFile(getContext(), testConfig.message)

      expect(getContext().bindings.signalRMessages[0].arguments).toStrictEqual(testConfig.expectedSignalRMessage.arguments)
      done()
    } catch (e) {
      done(e)
    }
  })
}
