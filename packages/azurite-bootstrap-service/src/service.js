import { getBlobServiceClient, getQueueServiceClient } from '@defra/bng-connectors-lib/azure-storage'
import { logger } from '@defra/bng-utils-lib'

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
        logger.info(`${container} container exists`)
      } else {
        await blobServiceClient.createContainer(container)
        logger.info(`Created ${container} container`)
      }
    }

    for await (const queue of queues) {
      if (await queueServiceClient.getQueueClient(queue).exists()) {
        logger.info(`${queue} queue exists`)
      } else {
        await queueServiceClient.createQueue(queue)
        logger.info(`Created ${queue} queue`)
      }
    }
  }
)()
