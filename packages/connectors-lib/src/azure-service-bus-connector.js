import { getServiceBusClient } from './helpers/azure-service-bus.js'

const serviceBusClient = getServiceBusClient()

const sendMessage = async config => {
  const sender = serviceBusClient.createSender(config.queueName)
  // will fail if batch/array is too large to send, however in practice only expecting one message to be sent.
  await sender.sendMessages(config.message)
  await sender.close()
}

export const serviceBusConnector = Object.freeze({
  sendMessage
})
