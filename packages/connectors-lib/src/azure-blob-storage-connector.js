import { getBlobServiceClient } from './helpers/azure-storage.js'

const blobServiceClient = getBlobServiceClient()

const deleteBlobIfExists = async config => {
  const options = {
    deleteSnapshots: 'include'
  }
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  return blockBlobClient.deleteIfExists(options)
}

const downloadStreamIfExists = async (logger, config) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const blobExists = await blockBlobClient.exists()
  let returnValue

  if (blobExists) {
    returnValue = blockBlobClient.download()
  } else {
    logger.log('Blob does not exist')
  }
  return returnValue
}

const downloadToBufferIfExists = async (logger, config) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const blobExists = await blockBlobClient.exists()
  let returnValue

  if (blobExists) {
    returnValue = blockBlobClient.downloadToBuffer(0)
  } else {
    logger.log('Blob does not exist for buffering')
  }
  return returnValue
}

const uploadStream = async (config, stream) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  await blockBlobClient.uploadStream(stream)
  if (config.metadata) {
    await blockBlobClient.setMetadata(config.metadata)
  }
}

const getBlockBlobClient = (containerName, blobName) => {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  return containerClient.getBlockBlobClient(blobName)
}

const downloadBlobToFileIfExists = async (logger, config) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const blobExists = await blockBlobClient.exists()
  let returnValue
  if (blobExists) {
    returnValue = await blockBlobClient.downloadToFile(config.fileNameWithPath)
  } else {
    logger.log('Blob does not exist')
  }
  return returnValue
}

export const blobStorageConnector = Object.freeze({
  deleteBlobIfExists,
  downloadStreamIfExists,
  downloadToBufferIfExists,
  uploadStream,
  downloadBlobToFileIfExists
})
