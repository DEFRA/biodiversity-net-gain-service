import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import constants from '../../../utils/constants.js'

const checkAnswers = require('../../developer/check-and-submit.js').default
const url = constants.routes.DEVELOPER_CHECK_AND_SUBMIT
jest.mock('../../../utils/http.js')
jest.mock('../../../utils/helpers.js')

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  describe('POST', () => {
    it('should process a valid application correctly', done => {
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
          jest.mock('../../../utils/helpers.js')
          const helpers = require('../../../utils/helpers.js')
          helpers.habitatTypeAndConditionMapper = jest.fn().mockImplementation(() => {
            return [{
              items: [{
                header: 'testHeader',
                description: 'testDescription',
                condition: 'testCondition',
                amount: 'testAmount'
              }]
            }]
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
          expect(redirectArgs).toEqual([constants.routes.DEVELOPER_CONFIRMATION])
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('should fail if backend errors', done => {
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
  })

  it('should throw an error page if validation fails for application', done => {
    jest.isolateModules(async () => {
      try {
        const session = setDeveloperApplicationSession()
        const postHandler = checkAnswers[1].handler
        session.set(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, undefined)

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

        await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "developerAllocation.applicant.contactId" is not allowed to be empty')
        expect(viewArgs).toEqual('')
        expect(redirectArgs).toEqual('')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
