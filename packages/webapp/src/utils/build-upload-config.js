import { uploadStreamAndAwaitScan } from './azure-storage.js'
import { handleEvents } from './azure-signalr.js'

const buildConfig = inputConfig => {
  const config = {
    uploadType: inputConfig.uploadType,
    fileExt: inputConfig.fileExt,
    maxFileSize: inputConfig.maxFileSize
  }
  buildBlobConfig(inputConfig.sessionId, config)
  // buildQueueConfig(config)
  // buildFunctionConfig(config)
  // buildSignalRConfig(inputConfig.sessionId, config)
  buildFileValidationConfig(config)
  return config
}

const buildBlobConfig = (sessionId, config) => {
  config.blobConfig = {
    blobName: `${sessionId}/${config.uploadType}/`,
    containerName: 'customer-uploads'
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: config.uploadType,
    queueName: 'untrusted-file-queue'
  }
}

const buildFunctionConfig = config => {
  config.functionConfig = {
    uploadFunction: uploadStreamAndAwaitScan,
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
    fileExt: config.fileExt,
    maxFileSize: config.maxFileSize
  }
}

export { buildConfig }
