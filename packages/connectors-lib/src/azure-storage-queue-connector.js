import { getQueueServiceClient } from './helpers/azure-storage.js'

const queueServiceClient = getQueueServiceClient()

const sendMessage = async config => {
  const queueClient = queueServiceClient.getQueueClient(config.queueName)
  await queueClient.sendMessage(config.message, config.options)
}

export const storageQueueConnector = Object.freeze({
  sendMessage
})
