import { submitGetRequest } from '../helpers/server.js'
import { getFormattedDate } from '../../../utils/helpers.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICATION_LIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url} view`, done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          const mockReference = 'BNGCRD-ABCDE-12345'
          const mockProjectName = 'mock project name'
          const mockStatus = 'IN PROGRESS'
          const mockDate = new Date()
          http.postJson = jest.fn().mockImplementation(() => {
            return [{
              applicationReference: mockReference,
              lastUpdated: mockDate,
              applicationStatus: mockStatus,
              projectName: mockProjectName
            }]
          })
          const res = await submitGetRequest({ url }, 200, null, { expectedNumberOfPostJsonCalls: 1 })
          expect(res.payload).toContain(mockReference)
          expect(res.payload).toContain(mockProjectName)
          expect(res.payload).toContain(mockStatus)
          expect(res.payload).toContain(getFormattedDate(mockDate))
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
