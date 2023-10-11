import { submitGetRequest } from '../helpers/server.js'
import { promises as fs } from 'fs'
import constants from '../../../utils/constants.js'
const url = constants.routes.DOWNLOAD_LANDOWNER_CONSENT_FILE
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/written-consent'
jest.mock('../../../utils/azure-signalr.js')
jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  describe('GET', () => {
    it('It should download the mocked landownership consent document from blobStorageConnector', async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/49MB.pdf`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })
      await submitGetRequest({ url })
    })
  })
})
