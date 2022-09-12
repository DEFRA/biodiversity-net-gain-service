import { blobStorageConnector, storageQueueConnector, serviceBusConnector } from '@defra/bng-connectors-lib'

const uploadStreamAndQueueMessage = async (logger, config, stream) => {
  addFileDetailsToConfiguration(config, stream.filename)
  await blobStorageConnector.uploadStream(config.blobConfig, stream)

  if (process.env.AZURE_SERVICE_BUS_CONNECTION_STRING) {
    await serviceBusConnector.sendMessage(config.queueConfig)
  } else {
    await storageQueueConnector.sendMessage(config.queueConfig)
  }

  logger.log(`${new Date().toUTCString()} ${stream.filename} has been uploaded and message has been queued`)
}

const addFileDetailsToConfiguration = (config, filename) => {
  config.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`

  const message = {
    uploadType: config.queueConfig.uploadType,
    location: config.blobConfig.blobName
  }
  // Azure storage queues require data in base64 binary for function to process, however service Bus does not...
  config.queueConfig.message = Buffer.from(JSON.stringify(message)).toString('base64')  
}

export { uploadStreamAndQueueMessage }
