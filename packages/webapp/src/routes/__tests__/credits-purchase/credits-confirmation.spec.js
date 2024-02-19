import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import creditsConfirmation from '../../credits-purchase/credits-confirmation.js'

const url = constants.routes.CREDITS_PURCHASE_CONFIRMATION

const gainSiteReference = 'TEST-00000001-AKD3'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with formatted land owner application reference`, async () => {
      const getHandler = creditsConfirmation[0].handler
      const session = new Session()
      session.set(constants.redisKeys.CREDITS_APP_REFERENCE, gainSiteReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: url }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.CREDITS_PURCHASE_CONFIRMATION)
    })
  })
})
