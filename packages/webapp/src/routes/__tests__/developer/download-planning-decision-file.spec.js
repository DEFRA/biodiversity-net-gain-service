import { submitGetRequest } from '../helpers/server.js'
import { promises as fs } from 'fs'
import constants from '../../../utils/constants.js'
import application from '../../../__mock-data__/test-application.js'
const url = constants.routes.DEVELOPER_DOWNLOAD_PLANNING_DECISION_FILE
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/planning-decision-notice'
jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  describe('GET', () => {
    it('It should download the mocked document from blobStorageConnector', async () => {
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/planning-decision-notice.pdf`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })
      const sessionData = JSON.parse(application.dataString)
      sessionData[constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION] = 'planning-decision-notice.pdf'
      await submitGetRequest({ url }, 200, sessionData)
    })
  })
})
