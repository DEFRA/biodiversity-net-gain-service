import developerApplicationSession from '../../../__mocks__/developer-application-session.js'
import checkAnswers from '../../../routes/developer/check-answers.js'
import constants from '../../../utils/constants.js'
// import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.DEVELOPER_CHECK_ANSWERS
jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const session = developerApplicationSession()
          const getHandler = checkAnswers[0].handler

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

          await getHandler({ yar: session }, h)
          expect(viewArgs[0]).toEqual(constants.views.DEVELOPER_CHECK_ANSWERS)
          // Refactoring: could produce a Joi schema to validate returned data
          expect(typeof viewArgs[1].initialCapitalization).toEqual('function')
          expect(typeof viewArgs[1].dateToString).toEqual('function')
          expect(typeof viewArgs[1].hideClass).toEqual('function')
          expect()
          expect(viewArgs[1].routes).not.toBeUndefined()
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
  describe('POST', () => {
    it('Should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const session = developerApplicationSession()
          const postHandler = checkAnswers[1].handler

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

          await postHandler({ yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.DEVELOPER_APPLICATION_SUBMITTED])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          const session = developerApplicationSession()
          const postHandler = checkAnswers[1].handler

          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            throw new Error('test error')
          })

          await expect(postHandler({ yar: session })).rejects.toThrow('test error')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Should throw an error page if validation fails for application', done => {
      jest.isolateModules(async () => {
        try {
          const session = developerApplicationSession()
          const postHandler = checkAnswers[1].handler
          session.set(constants.redisKeys.DEVELOPER_FULL_NAME, undefined)

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

          await expect(postHandler({ yar: session }, h)).rejects.toThrow('ValidationError: "developerAllocation.applicant.name" is required')
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
          const session = developerApplicationSession()
          session.set(constants.redisKeys.DEVELOPER_CONSENT_ANSWER, undefined)

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

          await postHandler({ yar: session }, h)
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
