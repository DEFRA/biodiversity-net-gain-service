import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'
import developerApplicationData from '../../../__mocks__/developer-application-data.js'
import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import Session from '../../../__mocks__/session.js'

const checkAnswers = require('../../../routes/developer/check-answers.js').default
const url = constants.routes.DEVELOPER_CHECK_ANSWERS
jest.mock('../../../utils/http.js')

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`should successfully render the ${url.substring(1)} view on valid GET request`, async () => {
      await submitGetRequest({ url }, 200, developerApplicationData)
    })

    it('should redirect to START if APPLICATION_REFERENCE is null', async () => {
      const session = setDeveloperApplicationSession()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, null)
      const { handler } = checkAnswers.find(route => route.method === 'GET')
      const h = { redirect: jest.fn() }
      await handler({ yar: session }, h)
      expect(h.redirect).toHaveBeenCalledWith('/')
    })

    it('should redirect to Start page if no develper data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual('/')
    })
    it(`should render the ${url.substring(1)} view when application reference is present`, async () => {
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, 'some-reference')
      await submitGetRequest({ url }, 200, developerApplicationData)
    })
    it('should redirect to Start page when application reference is blank', async () => {
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_APP_REFERENCE, '')
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual('/')
    })
  })
  describe('POST', () => {
    it('Should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const session = setDeveloperApplicationSession()
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
          expect(redirectArgs).toEqual([constants.routes.APPLICATION_SUBMITTED])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          const session = setDeveloperApplicationSession()
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
    it('Should throw an error page if validation fails for application', done => {
      jest.isolateModules(async () => {
        try {
          const session = setDeveloperApplicationSession()
          const postHandler = checkAnswers[1].handler
          session.set(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST, undefined)

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

          await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "developerRegistration.development.localPlanningAuthority.name" must be a string')
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('pre bug fix test, should not fail if applicant consent has been taken', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkAnswers[1].handler
          const session = setDeveloperApplicationSession()
          session.set(constants.redisKeys.DEVELOPER_CONSENT_ANSWER, undefined)

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
          expect(redirectArgs[0]).toEqual('/application-submitted')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
