import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import creditsConfirmation from '../../credits-purchase/credits-confirmation.js'

const url = constants.routes.CREDITS_PURCHASE_CONFIRMATION

const creditReference = 'BNGCRD-GH67D-A-JK24'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with formatted credits application reference`, async () => {
      const getHandler = creditsConfirmation[0].handler
      const session = new Session()
      session.set(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, creditReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/credits/credits-check-your-answers' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.CREDITS_PURCHASE_CONFIRMATION)
    })

    it(`should render the ${url.substring(1)} view with formatted credits application reference`, async () => {
      const getHandler = creditsConfirmation[0].handler
      const session = new Session()
      session.set(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, null)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/credits/credits-check-your-answers' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.MANAGE_BIODIVERSITY_GAINS)
    })
  })
})
