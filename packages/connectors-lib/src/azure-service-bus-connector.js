import { getServiceBusClient } from './helpers/azure-service-bus.js'

const serviceBusClient = getServiceBusClient()

const sendMessage = async config => {
  const sender = serviceBusClient.createSender(config.queueName)

  const batch = await sender.createMessageBatch()
  batch.tryAddMessage({ body: config.message })
  await sender.sendMessages(batch)
  await sender.close()
}

export const serviceBusConnector = Object.freeze({
  sendMessage
})
