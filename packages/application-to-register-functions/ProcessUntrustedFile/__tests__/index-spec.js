import processUntrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { Readable } from 'stream'

jest.mock('@defra/bng-connectors-lib')
jest.mock('@defra/bng-document-service')

const uploadType = 'mock-upload-type'

const message = {
  uploadType,
  location: 'mock-data.json'
}

describe('Untrusted file processing', () => {
  it('should initiate threat processing, transfer a clean upload to the appropriate storage location and send a message to initiate further processing. ', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        const { screenDocumentForThreats } = require('@defra/bng-document-service')
        const mockData = JSON.stringify({ mock: 'data' })

        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async (context, config) => {
          const readable = Readable.from(mockData)
          return {
            readableStreamBody: readable
          }
        })

        screenDocumentForThreats.mockReturnValue(Readable.from(mockData))

        await processUntrustedFile(getContext(), message)

        setImmediate(async () => {
          await expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
          await expect(blobStorageConnector.uploadStream).toHaveBeenCalled()
          expect(getContext().bindings.trustedFileQueue).toStrictEqual(message)
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })

  it('should recognise when a non-existent file is referenced.', done => {
    jest.isolateModules(async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      try {
        await processUntrustedFile(getContext(), message)
        setImmediate(async () => {
          await expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
          await expect(blobStorageConnector.uploadStream).not.toHaveBeenCalled()
          await expect(getContext().bindings.trustedFileQueue).toBeUndefined()
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })
})
