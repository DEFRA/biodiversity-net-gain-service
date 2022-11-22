import applicationSession from '../../../__mocks__/application-session.js'
import checkAndSubmit from '../../../routes/land/check-and-submit.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHECK_AND_SUBMIT
jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          const getHandler = checkAndSubmit[0].handler

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
          expect(viewArgs[0]).toEqual(constants.views.CHECK_AND_SUBMIT)
          // Refactoring: could produce a Joi schema to validate returned data
          expect(viewArgs[1].application).not.toBeUndefined()
          expect(typeof viewArgs[1].boolToYesNo).toEqual('function')
          expect(viewArgs[1].changeLandownersHref).toEqual(constants.routes.ADD_LANDOWNERS)
          expect(typeof viewArgs[1].dateToString).toEqual('function')
          expect(typeof viewArgs[1].hideClass).toEqual('function')
          expect(viewArgs[1].hideConsent).toEqual(false)
          expect(typeof viewArgs[1].listArray).toEqual('function')
          expect(viewArgs[1].routes).not.toBeUndefined()
          expect(redirectArgs).toEqual('')

          // Do some operator specific data checks
          expect(viewArgs[1].application.applicant.role).toEqual('Other: test role')
          expect(viewArgs[1].application.legalAgreementParties[1].role).toEqual('Other: Test role')

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
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              gainSiteReference: 'test-reference'
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
          expect(redirectArgs).toEqual([constants.routes.REGISTRATION_SUBMITTED])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

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
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              gainSiteReference: 'test-reference'
            }
          })

          session.set(constants.redisKeys.FULL_NAME, undefined)

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

          await expect(postHandler({ yar: session }, h)).rejects.toThrow('ValidationError: "landownerGainSiteRegistration.applicant.lastName" is required')
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
