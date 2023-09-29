import { blobStorageConnector, storageQueueConnector } from '@defra/bng-connectors-lib'

const uploadStreamAndAwaitScan = async (logger, config, stream) => {
  addFileDetailsToConfiguration(config, stream.filename)
  await blobStorageConnector.uploadStream(config.blobConfig, stream)
  logger.log(`${new Date().toUTCString()} ${stream.filename} has been uploaded`)

  const tags = await new Promise(async(resolve) => {
    console.time()
    let blobTags
    const timeout = (ms) => {
      console.log(`Waiting ${ms}ms`)
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  
    do {
      await timeout(500)
      blobTags = await blobStorageConnector.getBlobTags(config.blobConfig)
    } while (Object.keys(blobTags.tags).length === 0)

    console.timeEnd()
    resolve(blobTags.tags)
  })
  // todo delete
  console.log(tags)
  return { tags, blobConfig: config.blobConfig }
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
  // await Promise.all([
  //   blobStorageConnector.deleteBlobIfExists({
  //     containerName: 'trusted',
  //     blobName
  //   }),
  //   blobStorageConnector.deleteBlobIfExists({
  //     containerName: 'untrusted',
  //     blobName
  //   })
  // ])
  await blobStorageConnector.deleteBlobIfExists({
    containerName: 'customer-uploads',
    blobName
  })
}

export { uploadStreamAndAwaitScan, deleteBlobFromContainers }
