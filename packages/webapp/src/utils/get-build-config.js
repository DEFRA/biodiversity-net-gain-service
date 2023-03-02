import { handleEvents } from './azure-signalr.js'
import { uploadStreamAndQueueMessage } from './azure-storage.js'
import constants from './constants.js'

const buildBlobConfig = (sessionId, config, options) => {
  const { containerName, uploadType } = options
  config.blobConfig = {
    blobName: `${sessionId}/${uploadType}/`,
    containerName
  }
}

const buildQueueConfig = (config, options) => {
  const { queueName, uploadType } = options
  config.queueConfig = {
    uploadType,
    queueName
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
    eventProcessingFunction: null,
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 180000,
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

const buildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: constants.metricFileExt
  }
}

const getBuildConfig = (sessionId, options) => {
  const config = {}
  buildBlobConfig(sessionId, config, options)
  buildQueueConfig(config, options)
  buildFunctionConfig(config)
  buildSignalRConfig(sessionId, config)
  buildFileValidationConfig(config)
  return config
}

export default getBuildConfig
