import { handleEvents } from '../azure-signalr.js'
import { logger } from 'defra-logging-facade'
import { queueStorageConnector } from '@defra/bng-connectors-lib'

describe('Azure SignalR integration', () => {
  it('should respond to an event', async () => {
    // Connect to the SignalR emulator and wait for an event.
    const config = {
      queueConfig: {
        message: Buffer.from('Test message').toString('base64'),
        // Delay message processing for two seconds to simulate real processing.
        options: { visibilityTimeout: 2 },
        queueName: 'trusted-file-queue'
      },
      signalRConfig: {
        url: 'http://localhost:8082/api?userId=Test'
      }
    }
    // Send a message to trigger a function that should cause the SignalR emulator to send an event.
    await queueStorageConnector.sendMessage(logger, config.queueConfig)

    // Wait for the SignalR event associated with message processing.
    await expect(handleEvents(config, ['Test event'])).resolves.toStrictEqual([{ mock: 'data' }])
  })
})
