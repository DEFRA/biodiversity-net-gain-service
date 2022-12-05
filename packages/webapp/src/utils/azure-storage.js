import { blobStorageConnector, storageQueueConnector } from '@defra/bng-connectors-lib'
import BngExtractionService from '../../../bng-metric-service/src/BngMetricExtractionService.js'
import { Readable } from 'stream'

const uploadStreamAndQueueMessage = async (logger, config, stream) => {
  addFileDetailsToConfiguration(config, stream.filename)
  await blobStorageConnector.uploadStream(config.blobConfig, stream)
  // TO DO - Current Azure functions download blobs from Azure manually as streams rather than
  // relying on the contents of a storage queue message to enable Azure to provide blobs as function
  // inputs (see https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input)
  //  As such use of Azure storage queues could be replaced with Azure service bus queues.
  await storageQueueConnector.sendMessage(config.queueConfig)
  logger.log(`${new Date().toUTCString()} ${stream.filename} has been uploaded and message has been queued`)
}

const addFileDetailsToConfiguration = (config, filename) => {
  config.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`

  const message = {
    uploadType: config.queueConfig.uploadType,
    location: config.blobConfig.blobName
  }

  config.queueConfig.message = Buffer.from(JSON.stringify(message)).toString('base64')
}

const downloadStreamAndQueueMessage = async (logger, config) => {
  addMetricDetailsToConfiguration(config, logger)
  // await blobStorageConnector.uploadStream(config.blobConfig, stream)
  // TO DO - Current Azure functions download blobs from Azure manually as streams rather than
  // relying on the contents of a storage queue message to enable Azure to provide blobs as function
  // inputs (see https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input)
  //  As such use of Azure storage queues could be replaced with Azure service bus queues.
  await storageQueueConnector.sendMessage(config.queueConfig)
  logger.log(`${new Date().toUTCString()} ${config.blobConfig.filename} has been downloaded and message has been queued`)
}

const addMetricDetailsToConfiguration = async (config, logger) => {
  // console.log('AJ3 in addMetricDetailsToConfiguration', config, filename, logger)
  config.blobConfig.blobName = `${config.blobConfig.blobName}${config.blobConfig.filename}`
  const extractService = new BngExtractionService()
  const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
  const readableStream = Readable.from(buffer)
  const metricData = await extractService.extractMetricContent(readableStream)

  const message = {
    uploadType: config.queueConfig.uploadType,
    containerName: config.blobConfig.containerName,
    location: config.blobConfig.blobName,
    metricData
  }

  config.queueConfig.message = Buffer.from(JSON.stringify(message)).toString('base64')
}

export { uploadStreamAndQueueMessage, downloadStreamAndQueueMessage }
