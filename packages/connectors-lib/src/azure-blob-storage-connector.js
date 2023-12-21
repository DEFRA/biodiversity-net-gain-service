import { getBlobServiceClient } from './helpers/azure-storage.js'

const blobServiceClient = getBlobServiceClient()

const copyBlob = async config => {
  const sourceBlockBlobClient = getBlockBlobClient(config.source.containerName, config.source.blobName)
  const targetBlockBlobClient = getBlockBlobClient(config.target.containerName, config.target.blobName)
  const poller = await targetBlockBlobClient.beginCopyFromURL(sourceBlockBlobClient.url)
  return poller.pollUntilDone()
}

const deleteBlobIfExists = async config => {
  const options = {
    deleteSnapshots: 'include'
  }

  // Defect BNGP-1738
  // Networking in the official environments appears to conflict with Microsoft Azure code used to construct
  // a BlockBlobClent involving a null value. This problem does not occur when connecting to Azurite or
  // Microsoft Azure blob storage directly.
  if (config.containerName !== null &&
      config.containerName !== undefined &&
      config.blobName !== null &&
      config.blobName !== undefined) {
    const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
    return blockBlobClient.deleteIfExists(options)
  } else {
    // The blob cannot exist.
    return Promise.resolve(false)
  }
}

const downloadStreamIfExists = async (logger, config) => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const blobExists = await blockBlobClient.exists()
  let returnValue

  if (blobExists) {
    returnValue = await blockBlobClient.download()
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

const moveBlob = async config => {
  await copyBlob(config)
  return deleteBlobIfExists(config.source)
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

const getBlobSizeInBytes = async config => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  const properties = await blockBlobClient.getProperties()
  return properties.contentLength
}

const getBlobTags = async config => {
  const blockBlobClient = getBlockBlobClient(config.containerName, config.blobName)
  return await blockBlobClient.getTags()
}

const findBlobsInContainerByTags = async config => {
  const containerClient = blobServiceClient.getContainerClient(config.containerName)
  return containerClient.findBlobsByTags(config.tags)
}

export const blobStorageConnector = Object.freeze({
  copyBlob,
  deleteBlobIfExists,
  downloadStreamIfExists,
  downloadToBufferIfExists,
  getBlobSizeInBytes,
  moveBlob,
  uploadStream,
  getBlobTags,
  findBlobsInContainerByTags
})
