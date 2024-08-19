import constants from '../../../utils/constants.js'
import Session from '../../../__mocks__/session.js'
import applicationSubmitted from '../../combined-case/application-submitted.js'

const url = constants.routes.COMBINED_CASE_CONFIRMATION
const combinedCaseReference = 'BNGREG-GB0688-ASK17'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with combined case application reference`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, combinedCaseReference)
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/combined-case/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.APPLICATION_SUBMITTED)
      expect(viewArgs[1].applicationReference).toEqual(combinedCaseReference)
    })

    it(`should render the ${url.substring(1)} view with formatted sort code`, async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, combinedCaseReference)
      session.set('bacs', { sortCode: '60 70 80' })
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/combined-case/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.APPLICATION_SUBMITTED)
      expect(viewArgs[1].bacs.sortCode).toEqual('60 70 80')
    })

    it('should render payment fee details', async () => {
      const getHandler = applicationSubmitted[0].handler
      const session = new Session()
      session.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, combinedCaseReference)
      session.set('payment', {
        caseType: 'combined-case',
        fee: 600,
        reference: combinedCaseReference,
        type: 'BACS'
      })
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await getHandler({ headers: { referer: 'http://localhost/combined-case/check-and-submit' }, yar: session }, h)
      expect(viewArgs[0]).toEqual(constants.views.APPLICATION_SUBMITTED)
    })
  })
})
