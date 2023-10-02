import { blobStorageConnector, storageQueueConnector } from '@defra/bng-connectors-lib'
import constants from './constants.js'
import { performance } from 'perf_hooks'

const uploadStreamAndAwaitScan = async (logger, config, stream) => {
  const { filename } = stream
  await blobStorageConnector.uploadStream(config.blobConfig, stream)
  logger.log(`${new Date().toUTCString()} ${filename} has been uploaded`)

  return new Promise(async(resolve, reject) => {
    const start = performance.now()
    let blobTags
    const timeout = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    // Give Microsoft Defender 4s lead time
    // After testing on Azure infrastructure apply a sensible lead time wait.
    // await timeout(4000)
    const wait = 1000
    let maxAttempts = 20, attempts = 0
    do {
      await timeout(wait)
      blobTags = await blobStorageConnector.getBlobTags(config.blobConfig)
      attempts++
    } while (Object.keys(blobTags.tags).length === 0 && attempts < maxAttempts)

    const end = performance.now()

    if (Object.keys(blobTags.tags).length === 0) {
      logger.log(`${new Date().toUTCString()} ${filename} No malware scan response after ${Math.round(end - start)}ms`)
      reject(new Error(constants.uploadErrors.noFileScanResponse))
    } else {
      logger.log(`${new Date().toUTCString()} ${filename} malware scan response after ${Math.round(end - start)}ms`)
      logger.log(`${new Date().toUTCString()} ${filename} malware scan results: ${JSON.stringify(blobTags.tags)}`)
      resolve(blobTags.tags)
    }
  })
}

const deleteBlobFromContainers = async blobName => {
  await blobStorageConnector.deleteBlobIfExists({
    containerName: 'customer-uploads',
    blobName
  })
}

export { uploadStreamAndAwaitScan, deleteBlobFromContainers }
