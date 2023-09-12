import constants from '../../utils/constants.js'
import Session from '../../__mocks__/session.js'
import applicationSubmitted from '../application-submitted.js'
const url = constants.routes.APPLICATION_SUBMITTED

const gainSiteReference = 'TEST-00000001-AKD3'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with formatted land owner application reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.APPLICATION_REFERENCE, gainSiteReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/land/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual('application-submitted')
      expect(viewArgs[1].applicationReference).toEqual(gainSiteReference)
    })
    it(`should render the ${url.substring(1)} view with formatted sort code`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.APPLICATION_REFERENCE, gainSiteReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/land/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual('application-submitted')
      expect(viewArgs[1].bacs.sortCode).toEqual('12 34 56')
    })
    it(`should render the ${url.substring(1)} view with formatted developer reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, gainSiteReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/developer/check-answers' }, yar: session }, h)
      expect(viewArgs[0]).toEqual('application-submitted')
      expect(viewArgs[1].applicationReference).toEqual(gainSiteReference)
    })
    it(`should render the ${url.substring(1)} view with no reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, '')
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: '' }, yar: session }, h)
      expect(viewArgs[0]).toEqual('application-submitted')
      expect(viewArgs[1].applicationReference).toEqual(null)
    })
    it('should render payment fee details', async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.APPLICATION_REFERENCE, gainSiteReference)
      session.set('payment', {
        caseType: 'registration',
        fee: 600,
        reference: gainSiteReference,
        type: 'BACS'
      })
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/land/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual('application-submitted')
    })
  })
})
