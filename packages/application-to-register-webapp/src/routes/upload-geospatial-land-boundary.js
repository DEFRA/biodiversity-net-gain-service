// import Joi from 'joi'
import { logger } from 'defra-logging-facade'
import { uploadStreamAndQueueMessage } from '../utils/azure-storage.js'
import constants from '../utils/constants.js'
import { uploadFile } from '../utils/upload.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_GEOSPATIAL_LAND_BOUNDARY)
  },
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
    const landBoundaryData = await uploadFile(logger, request, h, config)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, landBoundaryData.location)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG, landBoundaryData.mapConfig)
    return h.redirect(constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY)
  }
}

const buildConfig = (sessionId) => {
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

const buildQueueConfig = (config) => {
  // Configuration for storage queue based triggering of upload processing.
  // Queue based triggering is used as blob triggering can experience delays
  // due to its poll based nature.
  config.queueConfig = {
    uploadType: constants.uploadTypes.GEOSPATIAL_LAND_BOUNDARY,
    queueName: 'untrusted-file-queue'
  }
}

const buildFunctionConfig = (config) => {
  config.functionConfig = {
    uploadFunction: uploadStreamAndQueueMessage
  }
}

// TO DO - Refactor to reduce direct coupling to Microsoft Azure.
const buildSignalRConfig = (sessionId, config) => {
  config.signalRConfig = {
    // The session ID is used as the SignalR userID.
    // This ensures that notification of the processed upload is only sent to
    // the SignalR client connection associated with this session.
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`,
    eventName: 'geospatial-land-boundary-processed'
  }
}

const uploadGeospatialLandBoundaryRoutes = [{
  method: 'GET',
  path: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.post,
  options: {
    payload: {
      maxBytes: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB * 1024,
      multipart: true,
      output: 'stream',
      parse: false
    }
  }
}]

export default uploadGeospatialLandBoundaryRoutes
