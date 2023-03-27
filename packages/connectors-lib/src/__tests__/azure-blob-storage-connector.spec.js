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

  it('should upload a stream to blob storage and allow subsequent download using environment variable configuration, followed by deletion of blob', async () => {
    const mockData = { mock: 'data' }
    const expectedBlobSizeInBytes = Buffer.from(JSON.stringify(mockData)).length
    await blobStorageConnector.uploadStream(config, Readable.from(JSON.stringify(mockData)))
    await expect(blobExists(config.containerName, config.blobName)).resolves.toStrictEqual(true)

    const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
    expect(buffer).toBeDefined()
    expect(JSON.parse(buffer.toString())).toStrictEqual(mockData)

    const blobSizeInBytes = await blobStorageConnector.getBlobSizeInBytes(config)
    expect(blobSizeInBytes).toBe(expectedBlobSizeInBytes)
    const response = await blobStorageConnector.downloadStreamIfExists(logger, config)
    expect(response).toBeDefined()
    response.readableStreamBody.on('data', chunk => {
      expect(JSON.parse(chunk.toString())).toStrictEqual(mockData)
    })

    // delete blob and check no longer exists in storage
    await blobStorageConnector.deleteBlobIfExists(config)
    const response2 = await blobStorageConnector.downloadToBufferIfExists(logger, config)
    expect(response2).toBeUndefined()
  })
  it('should upload a stream to blob storage and allow subsequent download using environment variable configuration, with file metadata', async () => {
    const mockData = { mock: 'data' }
    config.metadata = { foo: 'bar' }
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
    expect(response.metadata).toBeDefined()
    expect(response.metadata.foo).toStrictEqual('bar')
  })
  it('should return undefined if an attempt is made to download a non-existent blob to a buffer', async () => {
    const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
    expect(buffer).toBeUndefined()
  })
  it('should return undefined if an attempt is made to download a non-existent blob as a stream', done => {
    jest.isolateModules(async () => {
      // Use default storage queue configuration with a mock to increase test coverage.
      delete process.env.AZURE_QUEUE_SERVICE_URL
      try {
        jest.mock('../helpers/azure-storage.js')
        const { getQueueServiceClient } = require('../helpers/azure-storage.js')
        getQueueServiceClient.mockImplementation(() => {})
        const response = await blobStorageConnector.downloadStreamIfExists(logger, config)
        setImmediate(() => {
          expect(response).toBeUndefined()
          done()
        })
      } catch (err) {
        done(err)
      }
    })
  })
  it('should allow a blob to be copied', async () => {
    const copyConfig = {
      source: {
        containerName: config.containerName,
        blobName: config.blobName
      },
      target: {
        containerName: 'trusted',
        blobName: config.blobName
      }
    }

    const mockData = { mock: 'data' }

    await blobStorageConnector.uploadStream(config, Readable.from(JSON.stringify(mockData)))
    await blobStorageConnector.copyBlob(copyConfig)
    await expect(blobExists(copyConfig.source.containerName, copyConfig.source.blobName)).resolves.toStrictEqual(true)
    await expect(blobExists(copyConfig.target.containerName, copyConfig.target.blobName)).resolves.toStrictEqual(true)
    const sourceBuffer = await blobStorageConnector.downloadToBufferIfExists(logger, copyConfig.source)
    const targetBuffer = await blobStorageConnector.downloadToBufferIfExists(logger, copyConfig.target)
    expect(sourceBuffer).toBeDefined()
    expect(targetBuffer).toBeDefined()
    expect(JSON.parse(sourceBuffer.toString())).toStrictEqual(mockData)
    expect(JSON.parse(targetBuffer.toString())).toStrictEqual(mockData)
  })
  it('should allow a blob to be moved', async () => {
    const copyConfig = {
      source: {
        containerName: config.containerName,
        blobName: config.blobName
      },
      target: {
        containerName: 'trusted',
        blobName: config.blobName
      }
    }

    const mockData = { mock: 'data' }

    await blobStorageConnector.uploadStream(config, Readable.from(JSON.stringify(mockData)))
    await blobStorageConnector.moveBlob(copyConfig)
    await expect(blobExists(copyConfig.source.containerName, copyConfig.source.blobName)).resolves.toStrictEqual(false)
    await expect(blobExists(copyConfig.target.containerName, copyConfig.target.blobName)).resolves.toStrictEqual(true)
    const sourceBuffer = await blobStorageConnector.downloadToBufferIfExists(logger, copyConfig.source)
    const targetBuffer = await blobStorageConnector.downloadToBufferIfExists(logger, copyConfig.target)
    expect(sourceBuffer).toBeUndefined()
    expect(targetBuffer).toBeDefined()
    expect(JSON.parse(targetBuffer.toString())).toStrictEqual(mockData)
  })
  it('should not attempt to delete a blob with a null container name', async () => {
    const config = {
      containerName: null,
      blobName: 'mockBlob'
    }
    await expect(blobStorageConnector.deleteBlobIfExists(config)).resolves.toStrictEqual(false)
  })
  it('should not attempt to delete a blob with a null blob name', async () => {
    const config = {
      containerName: 'mockContainer',
      blobName: null
    }
    await expect(blobStorageConnector.deleteBlobIfExists(config)).resolves.toStrictEqual(false)
  })
  it('should not attempt to delete a blob with an undefined container name', async () => {
    const config = {
      containerName: undefined,
      blobName: 'mockBlob'
    }
    await expect(blobStorageConnector.deleteBlobIfExists(config)).resolves.toStrictEqual(false)
  })
  it('should not attempt to delete a blob with an undefined blob name', async () => {
    const config = {
      containerName: 'mockContainer',
      blobName: undefined
    }
    await expect(blobStorageConnector.deleteBlobIfExists(config)).resolves.toStrictEqual(false)
  })
})
