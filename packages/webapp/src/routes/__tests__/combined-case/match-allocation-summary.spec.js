import { submitGetRequest } from '../helpers/server.js'
import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import constants from '../../../utils/constants.js'

const matchAllocationSummary = require('../../combined-case/match-allocation-summary.js').default
const url = constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view `, async () => {
      const res = await submitGetRequest({ url }, 200)
      expect(res.payload).not.toContain('Geoff')
    })
  })

  describe('POST', () => {
    it('should process a valid application correctly', async () => {
      const session = setDeveloperApplicationSession()
      const postHandler = matchAllocationSummary[1].handler

      const payload = {}
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await postHandler({ yar: session, auth, payload }, h)
      expect(h.view).not.toHaveBeenCalled()
      expect(h.redirect).toHaveBeenCalledWith(constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY)
    })
  })
})
