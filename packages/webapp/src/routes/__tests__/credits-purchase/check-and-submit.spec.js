import { submitGetRequest } from '../helpers/server.js'
import creditsApplicationData from '../../../__mocks__/credits-application-data.js'
import setCreditsApplicationSession from '../../../__mocks__/credits-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const checkAnswers = require('../../credits-purchase/check-and-submit.js').default
const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS
jest.mock('../../../utils/http.js')

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url }, 200, creditsApplicationData)
    })
  })

  describe('POST', () => {
    it('should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const session = setCreditsApplicationSession()
          const postHandler = checkAnswers[1].handler

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
          expect(redirectArgs).toEqual([creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRMATION])
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          const session = setCreditsApplicationSession()
          const postHandler = checkAnswers[1].handler

          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            throw new Error('test error')
          })

          await expect(postHandler({ yar: session, auth })).rejects.toThrow('test error')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })

  it('should throw an error page if validation fails for application', done => {
    jest.isolateModules(async () => {
      try {
        const session = setCreditsApplicationSession()
        const postHandler = checkAnswers[1].handler
        session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, undefined)

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

        const authCopy = JSON.parse(JSON.stringify(auth))
        authCopy.credentials.account.idTokenClaims.contactId = ''

        await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "creditsPurchase.applicant.contactId" is not allowed to be empty')
        expect(viewArgs).toEqual('')
        expect(redirectArgs).toEqual('')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
