import processUntrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { Readable } from 'stream'
import { ThreatScreeningError } from '@defra/bng-errors-lib'

jest.mock('@defra/bng-connectors-lib')
jest.mock('@defra/bng-document-service')

const filename = 'mock-data.json'
const mockData = 'mock-data'
const mockError = new Error(mockData)
const userId = 'mockSessionId'
const uploadType = 'mock-upload-type'

const message = {
  uploadType,
  location: `${userId}/${uploadType}/${filename}`
}

const mockDownloadStreamIfExists = async (context, config) => {
  const readable = Readable.from(mockData)
  return {
    readableStreamBody: readable
  }
}

const performUnsuccessfulThreatScreening = async (done, errorToThrow, expectedArguments) => {
  try {
    const expectedSignalRMessage = {
      userId,
      target: `Processed ${filename}`,
      arguments: expectedArguments
    }

    const { blobStorageConnector } = require('@defra/bng-connectors-lib')
    const { screenDocumentForThreats } = require('@defra/bng-document-service')
    screenDocumentForThreats.mockRejectedValue(errorToThrow)

    blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)

    await processUntrustedFile(getContext(), message)
    setImmediate(async () => {
      await expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
      await expect(blobStorageConnector.uploadStream).not.toHaveBeenCalled()
      await expect(getContext().bindings.trustedFileQueue).toBeUndefined()
      expect(getContext().bindings.signalRMessages).toStrictEqual([expectedSignalRMessage])
      done()
    })
  } catch (e) {
    done(e)
  }
}

describe('Untrusted file processing', () => {
  it('should initiate threat processing, transfer a clean upload to the appropriate storage location and send a message to initiate further processing. ', done => {
    jest.isolateModules(async () => {
      try {
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        const { screenDocumentForThreats } = require('@defra/bng-document-service')
        const mockData = JSON.stringify({ mock: 'data' })

        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)

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
          await expect(getContext().bindings.signalRMessages).toBeUndefined()
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })

  it('should send a SignalR notification when threat screening fails.', done => {
    const expectedArguments = [{
      threatScreeningDetails: mockError
    }]

    jest.isolateModules(async () => {
      await performUnsuccessfulThreatScreening(done, new ThreatScreeningError(mockError), expectedArguments)
    })
  })

  it('should send a SignalR notification when an unexpected error occurs.', done => {
    const expectedArguments = [{
      errorMessage: mockData
    }]

    jest.isolateModules(async () => {
      await performUnsuccessfulThreatScreening(done, mockError, expectedArguments)
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
