import { promises as fs } from 'fs'
import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DOWNLOAD_LEGAL_AGREEMENT
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'
jest.mock('@defra/bng-connectors-lib')

describe(url, () => {
  let h
  let redisMap
  let downloadLegalAgreementFile
  let responseMock
  beforeEach(() => {
    responseMock = {
      header: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    }
    h = {
      response: jest.fn(() => responseMock)
    }

    redisMap = new Map()
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'

      },
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.pdf',
        fileSize: 0.01,
        fileType: 'application/pdf',
        id: '2'
      }
    ])

    downloadLegalAgreementFile = require('../../land/download-legal-agreement-file.js')
  })
  describe('GET', () => {
    it('It should download the mocked document from blobStorageConnector', async () => {
      const request = {
        yar: redisMap,
        query: { id: '2' }
      }
      const { blobStorageConnector } = require('@defra/bng-connectors-lib')
      // Mock the downloadToBufferIfExists function with file buffer
      blobStorageConnector.downloadToBufferIfExists.mockImplementation(async () => {
        const file = await fs.readFile(`${mockDataPath}/legal-agreement.pdf`)
        return new Promise((resolve) => {
          resolve(file)
        })
      })
      await downloadLegalAgreementFile.default.handler(request, h)
      expect(h.response).toHaveBeenCalledWith(expect.any(Buffer))
      expect(h.response).toHaveBeenCalledTimes(1)
      expect(responseMock.header).toHaveBeenCalledTimes(1)
      expect(responseMock.header).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename= legal-agreement.pdf')
    })
    it('should return an error for empty id in query string', async () => {
      const queryUrl = url + '?id='
      const response = await submitGetRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should return an error for invalid id in query string', async () => {
      const queryUrl = url + '?id=$'
      const response = await submitGetRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
  })
})
