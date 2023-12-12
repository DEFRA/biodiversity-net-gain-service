import { submitGetRequest } from '../helpers/server.js'
import { promises as fs } from 'fs'
import constants from '../../../utils/constants.js'
import application from '../../../__mock-data__/test-application.js'
const url = constants.routes.DOWNLOAD_SCHEME_OF_WORKS_FILE
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/scheme-of-works'
jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  describe('GET', () => {
    it('It should download the mocked document from blobStorageConnector', async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/scheme-of-works.pdf`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.SCHEME_OF_WORKS_FILE_LOCATION] = 'scheme-of-works.pdf'
      await submitGetRequest({ url }, 200, sessionData)
    })
  })
})