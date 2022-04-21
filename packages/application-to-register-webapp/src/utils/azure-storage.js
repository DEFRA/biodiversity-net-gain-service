import { blobStorageConnector, queueStorageConnector } from '@defra/bng-connectors-lib'

const uploadStreamAndQueueMessage = async (logger, config, stream) => {
  addFileDetailsToConfiguration(logger, config, stream.filename)
  await blobStorageConnector.uploadStream(logger, config.blobConfig, stream)
  // TO DO - Current Azure functions download blobs from Azure manually as streams rather than
  // relying on the contents of a storage queue message to enable Azure to provide blobs as function
  // inputs (see https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#tabpanel_1_javascript).
  //  As such use of Azure storage queues could be replaced with Azure service bus queues.
  await queueStorageConnector.sendMessage(logger, config.queueConfig)
}

const addFileDetailsToConfiguration = (logger, config, filename) => {
  config.blobConfig.blobName = `${config.blobConfig.blobName}${filename}`

  const message = {
    uploadType: config.queueConfig.uploadType,
    location: config.blobConfig.blobName
  }

  config.queueConfig.message = Buffer.from(JSON.stringify(message)).toString('base64')
}

export { uploadStreamAndQueueMessage }
