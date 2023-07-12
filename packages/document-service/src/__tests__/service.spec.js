import { screenDocumentForThreats, uploadDocument } from '../service.js'
import axios from 'axios'
import fs from 'fs'
import { Readable } from 'stream'
import { getBearerToken } from '@defra/bng-utils-lib'

jest.mock('axios')
jest.mock('@defra/bng-utils-lib')

const logger = {
  log: jest.fn(),
  error: jest.fn()
}

describe('The document service', () => {
  it('should delegate the upload of a document to a configured function', async () => {
    const logger = {
      log: jest.fn()
    }
    const config = {
      functionConfig: {
        uploadFunction: jest.fn()
      }
    }

    const documentStream = Readable.from('mock document')
    await uploadDocument(logger, config, documentStream)
    // The upload function should have been called after the upload function has been removed from the configuration.
    expect(config.functionConfig.uploadFunction).toHaveBeenCalledWith(logger, {}, documentStream)
  })

  describe('threat screening', () => {
    const screenDocumentForThreatsWithMockError = async (logger, config, stream, status) => {
      const mockError = new Error()
      mockError.response = {
        status
      }

      axios.create.mockImplementation(config => axios)
      axios.request
        .mockRejectedValue(mockError)

      await expect(screenDocumentForThreats(logger, config, stream)).rejects.toEqual(mockError)
    }

    const config = {
      baseUrl: process.env.AV_API_BASE_URL,
      authenticationConfig: {
        url: process.env.AV_API_TOKEN_URL,
        clientId: process.env.AV_API_CLIENT_ID,
        clientSecret: process.env.AV_API_CLIENT_SECRET,
        scope: process.env.AV_API_SCOPE
      },
      fileConfig: {
        location: 'path/to/file'
      }
    }

    const getBearerTokenMockReturnValue = {
      data: {},
      status: 200,
      statusText: 'OK'
    }

    const putMockReturnValue = {
      data: {},
      status: 204,
      statusText: 'No Content'
    }

    let stream

    beforeEach(async () => {
      getBearerToken.mockReturnValue(getBearerTokenMockReturnValue)
      stream = fs.createReadStream('packages/document-service/src/__mock-data__/uploads/mock-data.json')
    })

    it('should make REST API calls when performing successful document security screening', done => {
      jest.isolateModules(async () => {
        axios.create.mockImplementation(config => axios)
        axios.request
          .mockReturnValueOnce(putMockReturnValue)

        await screenDocumentForThreats(logger, config, stream)
        expect(axios.request).toHaveBeenCalledTimes(1)
        await expect(axios.request).toHaveNthReturnedWith(1, putMockReturnValue)

        setImmediate(() => {
          done()
        })
      })
    })
    it('should throw an error when document screening fails', done => {
      delete process.env.AV_API_RESULT_RETRIEVAL_INTERVAL_MS
      process.env.AV_API_RESULT_RETRIEVAL_ATTEMPTS = 1
      jest.isolateModules(async () => {
        await screenDocumentForThreatsWithMockError(logger, config, stream, 500)
        expect(axios.request).toHaveBeenCalledTimes(1)
        setImmediate(() => {
          done()
        })
      })
      // Increase the test timeout to six seconds as each attempted retrieval of
      // screening results is delayed by five seconds by default.
    }, 6000)
    it('should throw an error when document screening fails 2', async () => {
      const axios = require('axios')
      const error = new Error('unit test error')
      axios.create.mockImplementation(config => axios)
      axios.request.mockImplementation(() => {
        throw error
      })

      await expect(screenDocumentForThreats(logger, config, stream))
        .rejects
        .toEqual(error)
    })
  })
})
