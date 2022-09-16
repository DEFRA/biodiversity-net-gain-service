import { submitGetRequest } from '../helpers/server.js'
import { promises as fs } from 'fs'
const url = '/land/download-legal-agreement-file'
const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('../../../utils/azure-signalr.js')
jest.mock('@defra/bng-connectors-lib')
jest.mock('path')

describe(url, () => {
  describe('GET', () => {
    it('It should download the mocked document from blobStorageConnector', async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/legal-agreement.pdf`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })

      // Mock the path.basename. //TODO better to inject the session yar values, but unsure how yet.
      const path = require('path')
      path.basename.mockImplementation(() => {
        return 'legal-agreement.pdf'
      })

      await submitGetRequest({ url })
    })
  })
})
