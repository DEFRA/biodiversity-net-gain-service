import Session from '../../../__mocks__/session.js'
import applicationSubmitted from '../../developer/application-submitted.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_CONFIRMATION

const creditReference = 'BNGCRD-GH67D-AJK25'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with formatted credits application reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, creditReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/developer/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.DEVELOPER_CONFIRMATION)
    })
  })
})
