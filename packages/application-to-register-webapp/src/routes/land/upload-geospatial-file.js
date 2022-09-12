import processGeospatialLandBoundaryEvent from './helpers/process-geospatial-land-boundary-event.js'
import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY),
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
    const geospatialData = (await uploadFiles(logger, request, config))
    logger.log(`${new Date().toUTCString()} Received land boundary data for ${geospatialData[0].location.substring(geospatialData[0].location.lastIndexOf('/') + 1)}`)
    request.yar.set(constants.redisKeys.GEOSPATIAL_LOCATION, geospatialData[0].location)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG, geospatialData[0].mapConfig)

    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_NAME, geospatialData.filename)
    request.yar.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, geospatialData.fileSize)

    return h.redirect(constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY)
  }
}

// TO DO - Refactor to reduce direct coupling to Microsoft Azure.
// For example, extract Microsoft Azure specfic configuration code to an Azure specific module.
const buildConfig = sessionId => {
  const config = {}
  buildBlobConfig(sessionId, config)
  buildQueueConfig(config)
  buildFunctionConfig(config)
  buildSignalRConfig(sessionId, config)
  return config
}

const buildBlobConfig = (sessionId, config) => {
  // Configuration for storing the upload in an untrusted area
  // of blob storage.
  config.blobConfig = {
    blobName: `${sessionId}/landBoundary/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  // Configuration for storage queue based triggering of upload processing.
  // Queue based triggering is used as blob triggering can experience delays
  // due to its poll based nature.
  config.queueConfig = {
    uploadType: constants.uploadTypes.GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE,
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
      maxBytes: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024,
      multipart: true,
      output: 'stream',
      parse: false
    }
  }
}]
