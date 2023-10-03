import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from './constants.js'
import { performance } from 'perf_hooks'
import { ThreatScreeningError } from '@defra/bng-errors-lib'

const uploadStreamAndAwaitScan = async (logger, config, stream, maxAttempts = 20) => {
  const { filename } = stream
  await blobStorageConnector.uploadStream(config.blobConfig, stream)
  logger.log(`${new Date().toUTCString()} ${filename} has been uploaded`)
  const start = performance.now()
  let blobTags
  const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // If we are using local azurite blob store then we need to ignore scan results and mock
  if (process.env.AZURE_BLOB_SERVICE_URL?.indexOf('azurite') > -1 ||
    process.env.AZURE_BLOB_SERVICE_URL?.indexOf('localhost') > -1 ||
    process.env.AZURE_BLOB_SERVICE_URL?.indexOf('127.0.0.1') > -1) {
    logger.log(`${new Date().toUTCString()} Malware scanning is mocked for Azurite usage`)
    return {
      'Malware Scanning scan result': 'No threats found',
      'Malware Notes': 'Mocked scan result for Azurite blob storage'
    }
  }

  // Give Microsoft Defender 4s lead time
  // After testing on Azure infrastructure apply a sensible lead time wait.
  // await timeout(4000)
  const wait = 1000
  let attempts = 0
  do {
    await timeout(wait)
    blobTags = await blobStorageConnector.getBlobTags(config.blobConfig)
    attempts++
  } while (Object.keys(blobTags.tags).length === 0 && attempts < maxAttempts)

  const end = performance.now()

  if (Object.keys(blobTags.tags).length === 0) {
    logger.log(`${new Date().toUTCString()} ${filename} No malware scan response after ${Math.round(end - start)}ms`)
    throw new ThreatScreeningError(constants.uploadErrors.noFileScanResponse)
  } else {
    logger.log(`${new Date().toUTCString()} ${filename} malware scan response after ${Math.round(end - start)}ms`)
    logger.log(`${new Date().toUTCString()} ${filename} malware scan results: ${JSON.stringify(blobTags.tags)}`)
    return blobTags.tags
  }
}

const deleteBlobFromContainers = async blobName => {
  await blobStorageConnector.deleteBlobIfExists({
    containerName: constants.BLOB_STORAGE_CONTAINER,
    blobName
  })
}

export { uploadStreamAndAwaitScan, deleteBlobFromContainers }
