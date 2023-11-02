import { Readable } from 'stream'
import { logger } from 'defra-logging-facade'
import { uploadStreamAndAwaitScan } from '../azure-storage.js'

const config = {
  blobConfig: {
    containerName: 'customer-uploads',
    blobName: 'mock-data.json'
  }
}

describe('azure-storage tests', () => {
  it('Should upload a stream and get mocked tags returned', async () => {
    const mockData = { mock: 'data' }
    const res = await uploadStreamAndAwaitScan(logger, config, Readable.from(JSON.stringify(mockData)))
    expect(res['Malware Scanning scan result']).toEqual('No threats found')
    expect(res['Malware Notes']).toEqual('Mocked scan result for Azurite blob storage')
  }, 20000)
  it('Should attempt to get tags twice if not on azurite and throw error as no tags', (done) => {
    jest.isolateModules(async () => {
      try {
        process.env.AZURE_BLOB_SERVICE_URL = ''
        jest.mock('@defra/bng-connectors-lib')
        const { uploadStreamAndAwaitScan } = require('../azure-storage.js')
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')

        blobStorageConnector.getBlobTags = jest.fn().mockImplementation(async config => {
          return {
            tags: {}
          }
        })

        const spy = jest.spyOn(blobStorageConnector, 'getBlobTags')

        const mockData = { mock: 'data' }
        await expect(uploadStreamAndAwaitScan(logger, config, Readable.from(JSON.stringify(mockData)), 2))
          .rejects
          .toThrow()
        expect(spy).toHaveBeenCalledTimes(2)
        done()
      } catch (err) {
        done(err)
      }
    })
  }, 20000)

  it('Should attempt to get tags once if available', (done) => {
    jest.isolateModules(async () => {
      try {
        process.env.AZURE_BLOB_SERVICE_URL = ''
        jest.mock('@defra/bng-connectors-lib')
        const { uploadStreamAndAwaitScan } = require('../azure-storage.js')
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')

        const tags = {
          'Malware Scanning scan result': 'No threats found',
          'Malware Notes': 'Mocked scan result for Azurite blob storage'
        }

        blobStorageConnector.getBlobTags = jest.fn().mockImplementation(async config => {
          return {
            tags
          }
        })

        const spy = jest.spyOn(blobStorageConnector, 'getBlobTags')

        const mockData = { mock: 'data' }
        const res = await uploadStreamAndAwaitScan(logger, config, Readable.from(JSON.stringify(mockData)), 2)
        expect(res).toEqual(tags)
        expect(spy).toHaveBeenCalledTimes(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  }, 20000)
})
