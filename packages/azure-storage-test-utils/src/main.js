import { getBlobServiceClient, getQueueServiceClient } from '@defra/bng-connectors-lib/azure-storage'
import { logger } from '@defra/bng-utils-lib'

const containerNames = ['customer-uploads']
const queueNames = [
  'saved-application-session-notification-queue',
  'expiring-application-session-notification-queue'
]

const blobServiceClient = getBlobServiceClient()
const queueServiceClient = getQueueServiceClient()

const recreateContainer = async (containerName) => {
  const containerClient = await blobServiceClient.getContainerClient(containerName)
  await containerClient.deleteIfExists()
  await containerClient.createIfNotExists()
  logger.info(`(Re)created ${containerName} container`)
}

const recreateContainers = async () => {
  for await (const containerName of containerNames) {
    await recreateContainer(containerName)
  }
}

const recreateQueue = async (queueName) => {
  const queueClient = await queueServiceClient.getQueueClient(queueName)
  await queueClient.deleteIfExists()
  await queueClient.createIfNotExists()
  logger.info(`(Re)created ${queueName} queue`)
}

const recreateQueues = async () => {
  for await (const queueName of queueNames) {
    await recreateQueue(queueName)
  }
}

const clearQueues = async () => {
  for await (const queueName of queueNames) {
    await clearQueue(queueName)
  }
}

const clearQueue = async (queueName) => {
  const queueClient = await queueServiceClient.getQueueClient(queueName)
  await queueClient.clearMessages()
  logger.info(`Cleared ${queueName} queue`)
}

const blobExists = async (containerName, blobName) => {
  return blobServiceClient.getContainerClient(containerName).getBlockBlobClient(blobName).exists()
}

const isUploadComplete = async (containerName, blobName, checkDelayMillis) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      resolve(await blobExists(containerName, blobName))
    }, checkDelayMillis)
  })
}

const receiveMessages = async (queueName, queueReceiveMessageOptions) => {
  const queueClient = await queueServiceClient.getQueueClient(queueName)
  return queueClient.receiveMessages(queueReceiveMessageOptions)
}

export { blobExists, clearQueues, isUploadComplete, receiveMessages, recreateContainers, recreateQueues }
