import { submitGetRequest } from '../helpers/server.js'
import setCreditsApplicationSession from '../../../__mocks__/credits-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const checkYourAnswers = require('../../credits-purchase/cdd-cya.js').default
const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE
jest.mock('../../../utils/http.js')

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view for an individual application`, async () => {
      const session = setCreditsApplicationSession()
      const res = await submitGetRequest({ url }, 200, session.values)
      expect(res.payload).toContain('Geoff')
    })

    it('should handle missing values from the metric', async () => {
      const session = setCreditsApplicationSession()
      session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA, { startPage: { } })
      await submitGetRequest({ url }, 200, session.values)
    })
  })

  describe('POST', () => {
    it('should continue to task list', done => {
      jest.isolateModules(async () => {
        try {
          const session = setCreditsApplicationSession()
          const postHandler = checkYourAnswers[1].handler

          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              applicationReference: 'test-reference'
            }
          })

          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session, auth }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
