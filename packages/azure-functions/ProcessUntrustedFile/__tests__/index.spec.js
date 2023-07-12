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
  location: `${userId}/${uploadType}/${filename}`,
  containerName: 'untrusted'
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
  beforeEach(() => {
    process.env.AV_DISABLE = 'false'
  })
  it('should initiate threat processing ', done => {
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
          await expect(blobStorageConnector.uploadStream).not.toHaveBeenCalled()
          await expect(screenDocumentForThreats).toHaveBeenCalled()
          expect(getContext().bindings.trustedFileQueue).toBeUndefined()
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
  it('should not send file for security screening if AV_DISABLE is false', done => {
    jest.isolateModules(async () => {
      try {
        process.env.AV_DISABLE = 'true'
        const { blobStorageConnector } = require('@defra/bng-connectors-lib')
        const { screenDocumentForThreats } = require('@defra/bng-document-service')
        const mockData = JSON.stringify({ mock: 'data' })
        const fileQueue = Object.assign(message, {
          containerName: 'trusted'
        })

        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(mockDownloadStreamIfExists)

        screenDocumentForThreats.mockReturnValue(Readable.from(mockData))

        await processUntrustedFile(getContext(), Object.assign({}, message))

        setImmediate(async () => {
          await expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
          await expect(blobStorageConnector.uploadStream).toHaveBeenCalled()
          await expect(screenDocumentForThreats).not.toHaveBeenCalled()
          expect(getContext().bindings.trustedFileQueue).toEqual(fileQueue)
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })
})
