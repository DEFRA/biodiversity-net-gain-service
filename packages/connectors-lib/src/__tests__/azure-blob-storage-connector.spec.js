import { Readable } from 'stream'
import { blobExists, recreateContainers } from '@defra/bng-azure-storage-test-utils'
import { blobStorageConnector } from '../connectors.js'
import { logger } from 'defra-logging-facade'

const config = {
  containerName: 'untrusted',
  blobName: 'mock-data.json'
}

describe('The Azure blob storage connector', () => {
  beforeEach(async () => {
    await recreateContainers()
  })

  it('should upload a stream to blob storage and allow subsequent download', async () => {
    const mockData = { mock: 'data' }
    await blobStorageConnector.uploadStream(config, Readable.from(JSON.stringify(mockData)))
    await expect(blobExists(config.containerName, config.blobName)).resolves.toStrictEqual(true)

    const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
    expect(buffer).toBeDefined()
    expect(JSON.parse(buffer.toString())).toStrictEqual(mockData)

    const response = await blobStorageConnector.downloadStreamIfExists(logger, config)
    expect(response).toBeDefined()
    response.readableStreamBody.on('data', chunk => {
      expect(JSON.parse(chunk.toString())).toStrictEqual(mockData)
    })
  })
  it('should return undefined if an attempt is made to download a non-existent blob to a buffer', async () => {
    const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
    expect(buffer).toBeUndefined()
  })
  it('should return undefined if an attempt is made to download a non-existent blob as a stream', async () => {
    const response = await blobStorageConnector.downloadStreamIfExists(logger, config)
    expect(response).toBeUndefined()
  })
})
