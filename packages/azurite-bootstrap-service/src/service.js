import { getBlobServiceClient, getQueueServiceClient } from '@defra/bng-connectors-lib/azure-storage'
import { logger } from 'defra-logging-facade'

const blobServiceClient = getBlobServiceClient()
const queueServiceClient = getQueueServiceClient()

const containers = ['customer-uploads']
const queues = [
  'saved-application-session-notification-queue',
  'expiring-application-session-notification-queue'
];
(
  async () => {
    for await (const container of containers) {
      if (await blobServiceClient.getContainerClient(container).exists()) {
        logger.log(`${container} container exists`)
      } else {
        await blobServiceClient.createContainer(container)
        logger.log(`Created ${container} container`)
      }
    }

    for await (const queue of queues) {
      if (await queueServiceClient.getQueueClient(queue).exists()) {
        logger.log(`${queue} queue exists`)
      } else {
        await queueServiceClient.createQueue(queue)
        logger.log(`Created ${queue} queue`)
      }
    }
  }
)()
