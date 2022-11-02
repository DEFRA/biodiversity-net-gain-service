import processGeospatialLandBoundaryEvent from '../../routes/land/helpers/process-geospatial-land-boundary-event.js'
import { CoordinateSystemValidationError, ThreatScreeningError, UploadTypeValidationError, ValidationError } from '@defra/bng-errors-lib'
import { handleEvents } from '../azure-signalr.js'
import { recreateQueues } from '@defra/bng-azure-storage-test-utils'
import { storageQueueConnector } from '@defra/bng-connectors-lib'

const baseQueueConfig = {
  // Delay message processing for two seconds to simulate real processing.
  options: { visibilityTimeout: 2 },
  queueName: 'signalr-test-queue'
}

const sendMessage = async message => {
  const config = {
    queueConfig: Object.assign({ message: Buffer.from(message).toString('base64') }, baseQueueConfig),
    signalRConfig: {
      eventProcessingFunction: processGeospatialLandBoundaryEvent,
      url: 'http://localhost:8082/api?userId=Test'
    }
  }

  if (process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) {
    config.signalRConfig.timeout = parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS)
  }

  // Send a message to trigger a function that should cause the SignalR emulator to send an event.
  await storageQueueConnector.sendMessage(config.queueConfig)
  return handleEvents(config, [`Processed ${message}`])
}

beforeEach(async () => {
  await recreateQueues()
})

describe('Azure SignalR integration', () => {
  it('should respond to an event indicating successful processing', async () => {
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('success')).resolves.toStrictEqual([{ mock: 'data' }])
  })
  it('should respond to an event indicating failed processing due to a coordinate system validation error', async () => {
    const expectedError = new CoordinateSystemValidationError('mockAuthorityKey', 'failure')
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('failure with authority key')).rejects.toEqual(expectedError)
  })
  it('should respond to an event indicating failed processing due to an upload type validation error', async () => {
    const expectedError = new UploadTypeValidationError('mockUploadType', 'failure')
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('failure with upload type')).rejects.toEqual(expectedError)
  })
  it('should respond to an event indicating failed processing due to a threat screening failure', async () => {
    const expectedError = new ThreatScreeningError({ threatScreeningDetails: 'mock data' })
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('failure with threat screening details')).rejects.toEqual(expectedError)
  })
  it('should respond to an event indicating failed processing due to a general validation error', async () => {
    const expectedError = new ValidationError('failure')
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('failure with error code')).rejects.toEqual(expectedError)
  })
  it('should respond to an event indicating failed processing due to a general error', async () => {
    const expectedError = new Error('failure')
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('failure with error message')).rejects.toEqual(expectedError)
  })
  it('should timeout when an event is not received within an expected period of time', async () => {
    const expectedError = new Error('Processed failure with error message timed out')
    process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS = '100'
    // Connect to the SignalR emulator and wait for an event associated with message processing
    await expect(sendMessage('failure with error message')).rejects.toEqual(expectedError)
  })
})
