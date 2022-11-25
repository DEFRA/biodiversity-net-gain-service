import processGeospatialLandBoundaryEvent from './helpers/process-geospatial-land-boundary-event.js'
import { CoordinateSystemValidationError, ThreatScreeningError, UploadTypeValidationError, ValidationError, uploadGeospatialLandBoundaryErrorCodes } from '@defra/bng-errors-lib'
import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const uploadGeospatialFileId = '#geospatialLandBoundary'

const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY),
  post: async (request, h) => performUpload(request, h)
}

// TO DO - Refactor to reduce direct coupling to Microsoft Azure.
// For example, extract Microsoft Azure specfic configuration code to an Azure specific module.
const buildConfig = sessionId => {
  const config = {}
  buildBlobConfig(sessionId, config)
  buildQueueConfig(config)
  buildFunctionConfig(config)
  buildSignalRConfig(sessionId, config)
  buildFileValidationConfig(config)
  return config
}

const buildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: constants.geospatialLandBoundaryFileExt,
    maximumDecimalPlaces: 4
  }
}

const buildBlobConfig = (sessionId, config) => {
  // Configuration for storing the upload in an untrusted area
  // of blob storage.
  config.blobConfig = {
    blobName: `${sessionId}/${constants.uploadTypes.GEOSPATIAL_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  // Configuration for storage queue based triggering of upload processing.
  // Queue based triggering is used as blob triggering can experience delays
  // due to its poll based nature.
  config.queueConfig = {
    uploadType: constants.uploadTypes.GEOSPATIAL_UPLOAD_TYPE,
    queueName: 'untrusted-file-queue'
  }
}

const buildFunctionConfig = config => {
  config.functionConfig = {
    uploadFunction: uploadStreamAndQueueMessage,
    handleEventsFunction: handleEvents
  }
}

const buildSignalRConfig = (sessionId, config) => {
  config.signalRConfig = {
    eventProcessingFunction: processGeospatialLandBoundaryEvent,
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 30000,
    // The session ID is used as the SignalR userID.
    // This ensures that notification of the processed upload is only sent to
    // the SignalR client connection associated with this session.
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

const performUpload = async (request, h) => {
  const config = buildConfig(request.yar.id)

  try {
    const geospatialData = await uploadFiles(logger, request, config)
    logger.log(`${new Date().toUTCString()} Received land boundary data for ${geospatialData[0].location.substring(geospatialData[0].location.lastIndexOf('/') + 1)}`)
    request.yar.set(constants.redisKeys.GEOSPATIAL_LOCATION, geospatialData[0].location)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG, geospatialData[0].mapConfig)
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_NAME, geospatialData.filename)
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, parseFloat(geospatialData.fileSize).toFixed(4))
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_TYPE, geospatialData.fileType)

    return h.redirect(constants.routes.CHECK_GEOSPATIAL_FILE)
  } catch (err) {
    const errorContext = getErrorContext(err)
    return h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY, errorContext)
  }
}

const getValidationErrorText = err => {
  let errorText

  switch (err.code) {
    case uploadGeospatialLandBoundaryErrorCodes.INVALID_FEATURE_COUNT:
      errorText = 'The selected file must only contain one polygon'
      break
    case uploadGeospatialLandBoundaryErrorCodes.INVALID_LAYER_COUNT:
      errorText = 'The selected file must only contain one layer'
      break
    case uploadGeospatialLandBoundaryErrorCodes.MISSING_COORDINATE_SYSTEM:
      errorText = 'The selected file must specify use of either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system'
      break
    default:
      // An unexpected error code has been received so rethrow the error.
      throw err
  }

  return errorText
}

const processErrorMessagge = (errorMessage, error) => {
  switch (errorMessage) {
    case constants.uploadErrors.noFile:
      error.err = [{
        text: 'Select a file showing the land boundary',
        href: uploadGeospatialFileId
      }]
      break
    case constants.uploadErrors.emptyFile:
      error.err = [{
        text: 'The selected file is empty',
        href: uploadGeospatialFileId
      }]
      break
    default:
      if (errorMessage.indexOf('timed out') > 0) {
        error.err = [{
          text: constants.uploadErrors.uploadFailure,
          href: uploadGeospatialFileId
        }]
      }
      break
  }
}

const getErrorContext = err => {
  const error = {}
  if (err instanceof CoordinateSystemValidationError) {
    error.err = [{
      text: 'The selected file must use either the Ordnance Survey Great Britain 1936 (OSGB36) or World Geodetic System 1984 (WGS84) coordinate reference system',
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof ThreatScreeningError) {
    const status = err.threatScreeningDetails.Status
    error.err = [{
      text: status === constants.threatScreeningStatusValues.QUARANTINED ? constants.uploadErrors.threatDetected : constants.uploadErrors.uploadFailure,
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof UploadTypeValidationError || err.message === constants.uploadErrors.unsupportedFileExt) {
    error.err = [{
      text: 'The selected file must be a GeoJSON, Geopackage or Shapefile',
      href: uploadGeospatialFileId
    }]
  } else if (err instanceof ValidationError) {
    error.err = [{
      text: getValidationErrorText(err),
      href: uploadGeospatialFileId
    }]
  } else {
    processErrorMessagge(err.message, error)
  }

  if (error.err) {
    // Prepare to redisplay the upload geospatial land boundary view with the configured error.
    return error
  } else {
    // An unexpected error has occurred. Rethrow it so that the default error page is returned.
    throw err
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.post,
  options: {
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      multipart: true,
      output: 'stream',
      parse: false,
      failAction: (request, h, err) => {
        logger.log('File upload too large', request.path)
        if (err.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB}MB`,
                href: uploadGeospatialFileId
              }
            ]
          }).takeover()
        } else {
          throw err
        }
      }
    }
  }
}]
