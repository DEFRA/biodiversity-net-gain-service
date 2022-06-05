import { getBlobServiceClient } from './helpers/azure-storage.js'

const blobServiceClient = getBlobServiceClient()

const downloadStreamIfExists = async (logger, config) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const blobExists = await blockBlobClient.exists()

  if (blobExists) {
    return blockBlobClient.download()
  } else {
    logger.log('Blob does not exist')
    Promise.resolve(undefined)
  }
}

const downloadToBufferIfExists = async (logger, config) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const blobExists = await blockBlobClient.exists()

  if (blobExists) {
    return blockBlobClient.downloadToBuffer(0)
  } else {
    logger.log('Blob does not exist')
    Promise.resolve(undefined)
  }
}

const uploadStream = async (config, stream) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  return blockBlobClient.uploadStream(stream)
}

const getBlockBlobClient = (containerName, blobName) => {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  return containerClient.getBlockBlobClient(blobName)
}

export const blobStorageConnector = Object.freeze({
  downloadStreamIfExists,
  downloadToBufferIfExists,
  uploadStream
})
