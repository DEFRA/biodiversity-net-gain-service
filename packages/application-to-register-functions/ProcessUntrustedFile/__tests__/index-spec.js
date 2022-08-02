import processUntrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'

jest.mock('@defra/bng-connectors-lib')

const uploadType = 'mock-upload-type'

const message = {
  uploadType,
  location: 'mock-data.json'
}

describe('Untrusted file processing', () => {
  it('should transfer trusted uploads to the appropriate storage location and send a message to initiate further processing. ', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')

        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async (context, config) => {
          const { Readable } = require('stream')
          const readable = Readable.from(JSON.stringify({ mock: 'data' }))
          return {
            readableStreamBody: readable
          }
        })

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

  it('should transfer file to trusted location and return signalr message if noprocess metadata flag is set to true', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')

        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async (context, config) => {
          const { Readable } = require('stream')
          const readable = Readable.from(JSON.stringify({ mock: 'data' }))
          return {
            readableStreamBody: readable,
            metadata: {
              noprocess: 'true'
            }
          }
        })

        await processUntrustedFile(getContext(), message)

        setImmediate(async () => {
          await expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
          await expect(blobStorageConnector.uploadStream).toHaveBeenCalled()
          expect(getContext().bindings.trustedFileQueue).toEqual(undefined)
          const signalRMessages = getContext().bindings.signalRMessages
          expect(signalRMessages[0].target).toEqual('Processed mock-data.json')
          expect(signalRMessages[0].arguments[0].location).toEqual('mock-data.json')
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })
})
