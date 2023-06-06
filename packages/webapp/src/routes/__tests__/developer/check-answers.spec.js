import developerApplicationSession from '../../../__mocks__/developer-application-session.js'
import checkAnswers from '../../../routes/developer/check-answers.js'
import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'
import developerApplicationData from '../../../__mocks__/developer-application-data.js'
import setDeveloperApplicationSession from '../../../__mocks__/developer-application-session.js'
import applicant from '../../../__mocks__/applicant.js'

const checkAnswers = require('../../../routes/developer/check-answers.js').default
const url = constants.routes.DEVELOPER_CHECK_ANSWERS
jest.mock('../../../utils/http.js')
const mockMetricFilePath = 'packages/webapp/src/__mock-data__/uploads/metric-file/metric-file.xlsx'
const mockConsentFilePath = 'packages/webapp/src/__mock-data__/uploads/written-consent/sample.docx'
const mockDevelopmentDetails = {
  startPage: {
    projectName: 'Test Project',
    planningAuthority: 'Test Authority',
    planningApplicationReference: 'Test Application Reference'
  }
}

const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  const redisMap = new Map()
  beforeEach(() => {
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, 'mock-metric-file-type')
    redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, 'mock-consent-file-type')
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, 5 * 1024)
    redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, 2 * 1024)
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockDevelopmentDetails)
    redisMap.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockMetricFilePath)
    redisMap.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockConsentFilePath)
    redisMap.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, '123')
    redisMap.set(constants.redisKeys.DEVELOPER_FULL_NAME, 'Test User')
    redisMap.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, 'test@example.com')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url }, 200, developerApplicationData)
    })
    it('should redirect to Start page if no develper data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
  })
  describe('POST', () => {
    it('Should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const session = setDeveloperApplicationSession()
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

          await postHandler({ yar: session, auth }, h)
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
          const session = setDeveloperApplicationSession()
          const postHandler = checkAnswers[1].handler

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

          const authCopy = JSON.parse(JSON.stringify(auth))
          authCopy.credentials.account.idTokenClaims.lastName = ''

          await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "developerAllocation.applicant.lastName" is not allowed to be empty')
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
          expect(redirectArgs[0]).toEqual('/developer/confirm')
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
