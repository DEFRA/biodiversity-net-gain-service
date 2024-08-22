import { submitGetRequest } from '../helpers/server.js'
import { promises as fs } from 'fs'
const url = '/developer/download-consent-to-allocate-gains-file'
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/written-consent'
jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  describe('GET', () => {
    // Mock the path.basename
    const path = require('path')
    const originalPathBasename = path.basename
    afterEach(() => {
      path.basename = originalPathBasename
    })

    it('It should download the mocked document from blobStorageConnector', async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/sample.docx`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })

      path.basename = jest.fn(() => {
        return 'sample.docx'
      })

      const { headers } = await submitGetRequest({ url })
      expect(headers['content-disposition']).toEqual('attachment; filename= sample.docx')
    })
  })
})
