import Session from '../../../__mocks__/session.js'
import applicationSubmitted from '../../developer/application-submitted.js'
import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'
import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session'
import paymentConstants from '../../../payment/constants.js'
import savePayment from '../../../payment/save-payment.js'

const url = constants.routes.DEVELOPER_CONFIRMATION

const allocationReference = 'BNGREG-FH67D-AJK25'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, allocationReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/developer/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.APPLICATION_SUBMITTED)
    })

    it('should render display the correct fee', async () => {
      const session = setDeveloperApplicationSession()
      savePayment(session, paymentConstants.ALLOCATION, 'TEST-1234')
      const res = await submitGetRequest({ url }, 200, session.values)
      expect(res.payload).toContain('£45')
    })
  })
})
