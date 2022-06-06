import { receiveMessages, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import { storageQueueConnector } from '../azure-storage-queue-connector.js'

const base64 = 'base64'

describe('The Azure blob storage connector', () => {
  beforeEach(async () => {
    await recreateQueues()
  })

  it('should send a message to a storage queue', async () => {
    const jsonMessage = {
      mock: 'data'
    }

    const config = {
      queueName: 'signalr-test-queue',
      message: Buffer.from(JSON.stringify(jsonMessage)).toString(base64)
    }

    await storageQueueConnector.sendMessage(config)
    const response = await receiveMessages(config.queueName, { numberOfMessages: 2 })
    expect(response.receivedMessageItems.length).toBe(1)
    expect(JSON.parse(Buffer.from(response.receivedMessageItems[0].messageText, base64).toString())).toStrictEqual(jsonMessage)
  })
})
