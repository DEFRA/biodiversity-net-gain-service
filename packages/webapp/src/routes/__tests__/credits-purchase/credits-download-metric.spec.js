import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest } from '../helpers/server.js'
import { promises as fs } from 'fs'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_DOWNLOAD_METRIC_FILE
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  describe('GET', () => {
    // Mock the path.basename. //TODO better to inject the session yar values, but unsure how yet.
    const path = require('path')
    const originalPathBasename = path.basename
    afterEach(() => {
      path.basename = originalPathBasename
    })

    it('It should download the mocked document from blobStorageConnector', async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/metric-file.xlsx`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })

      path.basename = jest.fn(() => {
        return 'metric-file.xlsx'
      })

      await submitGetRequest({ url })
    })
  })
})
