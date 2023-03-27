import { blobStorageConnector, storageQueueConnector } from '@defra/bng-connectors-lib'

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
    location: config.blobConfig.blobName,
    containerName: config.blobConfig.containerName
  }

  config.queueConfig.message = Buffer.from(JSON.stringify(message)).toString('base64')
}

const deleteBlobFromContainers = async blobName => {
  await Promise.all([
    blobStorageConnector.deleteBlobIfExists({
      containerName: 'trusted',
      blobName
    }),
    blobStorageConnector.deleteBlobIfExists({
      containerName: 'untrusted',
      blobName
    })
  ])
}

export { uploadStreamAndQueueMessage, deleteBlobFromContainers }
