import { getServiceBusClient } from './helpers/azure-service-bus.js'

let serviceBusClient

// Initialise function to allow for connectionString injection
const init = connectionString => {
  serviceBusClient = getServiceBusClient(connectionString)
}

const sendMessage = async config => {
  const sender = serviceBusClient.createSender(config.queueName)
  const batch = await sender.createMessageBatch()
  batch.tryAddMessage({ body: config.message })
  await sender.sendMessages(batch)
  await sender.close()
}

export const serviceBusConnector = Object.freeze({
  init,
  sendMessage
})
