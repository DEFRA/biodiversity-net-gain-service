import Session from '../../../__mocks__/session.js'
import applicationSubmitted from '../../credits-purchase/application-submitted.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRMATION

const creditReference = 'BNGCRD-GH67D-AJK24'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with formatted credits application reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, creditReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/credits/credits-check-your-answers' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRMATION)
    })

    it(`should render the ${url.substring(1)} view with formatted credits application reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, null)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/credits/credits-check-your-answers' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(creditsPurchaseConstants.views.MANAGE_BIODIVERSITY_GAINS)
    })
  })
})
