import processAVMessage from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { Readable } from 'stream'

jest.mock('@defra/bng-connectors-lib')

const mockData = 'mock-data'
const mockDownloadStreamIfExists = async (config, context) => {
  const readable = Readable.from(mockData)
  return {
    readableStreamBody: readable
  }
}
const mockUploadStream = async () => { }
const mockErrorResponse = async () => {
  throw new Error('test error')
}

const message = {
  Collection: 'legal-agreement',
  Extension: 'doc',
  Key: '3f71693c-3b1b-448c-827c-0ee181d49929',
  Name: 'legal-agreement',
  Service: 'bng',
  Status: 'Success'
}

const uploadMessage = {
  uploadType: 'legal-agreement',
  location: '3f71693c-3b1b-448c-827c-0ee181d49929/legal-agreement/legal-agreement.doc'
}

describe('Processing a response from AV scan', () => {
  /*
    Happy paths
      Process a message with Success status
      Process a message with a non Sucsess status
    Sad paths
      Blob storage stream download throws an error
      Blob storage uploadDocument throws an error
  */
  it('Should process a message with a Success status, downloading file stream, push to trusted blob and send message to trusted queue with no signalr message out', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        // Mock downloadStreamIfExists
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)
        // Mock uploadsteam
        blobStorageConnector.uploadStream = jest.fn().mockImplementation(mockUploadStream)

        // execute function
        await processAVMessage(getContext(), message)

        // do tests
        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(blobStorageConnector.uploadStream).toHaveBeenCalled()
        expect(getContext().bindings.trustedFileQueue).toStrictEqual(uploadMessage)
        expect(getContext().bindings.signalRMessages).toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should process a message with a non Success status, throwing a threat screening error and returning signalr message out', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        const nonSuccessMessage = JSON.parse(JSON.stringify(message))
        nonSuccessMessage.Status = 'FailedToVirusScan'
        await processAVMessage(getContext(), nonSuccessMessage)

        // do tests
        expect(blobStorageConnector.downloadStreamIfExists).not.toHaveBeenCalled()
        expect(blobStorageConnector.uploadStream).not.toHaveBeenCalled()
        expect(getContext().bindings.signalRMessages).not.toBeUndefined()
        expect(getContext().bindings.trustedFileQueue).toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should handle an error with downloading a stream after success AV scan, throwing a standard error and returning a signalr message out', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockErrorResponse)
        await processAVMessage(getContext(), message)

        // do tests
        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(blobStorageConnector.uploadStream).not.toHaveBeenCalled()
        expect(getContext().bindings.signalRMessages).not.toBeUndefined()
        expect(getContext().bindings.trustedFileQueue).toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should handle an error with upload the stream to blob storage, throwing a standard error and returning a signalr message out', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)
        blobStorageConnector.uploadStream = jest.fn().mockImplementation(mockErrorResponse)
        await processAVMessage(getContext(), message)

        // do tests
        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(blobStorageConnector.uploadStream).toHaveBeenCalled()
        expect(getContext().bindings.signalRMessages).not.toBeUndefined()
        expect(getContext().bindings.trustedFileQueue).toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
