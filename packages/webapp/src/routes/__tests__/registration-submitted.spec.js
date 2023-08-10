import constants from '../../utils/constants.js'
import Session from '../../__mocks__/session.js'
import registrationSubmitted from '../registration-submitted.js'
const url = constants.routes.REGISTRATION_SUBMITTED
const gainSiteReference = 'TEST-00000001-AKD3'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with application reference`, async () => {
      const getHandler = registrationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.APPLICATION_REFERENCE, gainSiteReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ yar: session }, h)
      expect(viewArgs[0]).toEqual('registration-submitted')
      expect(viewArgs[1].applicationReference).toEqual(gainSiteReference)
    })
  })
})
