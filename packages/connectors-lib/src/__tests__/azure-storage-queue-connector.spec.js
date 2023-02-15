import { receiveMessages, recreateQueues } from '@defra/bng-azure-storage-test-utils'
import { storageQueueConnector } from '../connectors.js'

const base64 = 'base64'

describe('The Azure blob storage connector', () => {
  beforeEach(async () => {
    await recreateQueues()
  })

  it('should send a message to a storage queue using environment variable configuration', done => {
    const jsonMessage = {
      mock: 'data'
    }

    const config = {
      queueName: 'signalr-test-queue',
      message: Buffer.from(JSON.stringify(jsonMessage)).toString(base64)
    }

    jest.isolateModules(async () => {
      // Use default blob service configuration with a mock to increase test coverage.
      delete process.env.AZURE_BLOB_SERVICE_URL
      try {
        jest.mock('../helpers/azure-storage.js')
        const { getBlobServiceClient } = require('../helpers/azure-storage.js')
        getBlobServiceClient.mockImplementation(() => {})
        await storageQueueConnector.sendMessage(config)
        const response = await receiveMessages(config.queueName, { numberOfMessages: 2 })
        setImmediate(() => {
          expect(response.receivedMessageItems.length).toBe(1)
          expect(JSON.parse(Buffer.from(response.receivedMessageItems[0].messageText, base64).toString())).toStrictEqual(jsonMessage)
          done()
        })
      } catch (err) {
        done(err)
      }
    })
  }, 20000)
})
