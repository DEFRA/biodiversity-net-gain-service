import applicationSession from '../../../__mocks__/application-session.js'
import constants from '../../../utils/constants.js'
import applicant from '../../../__mocks__/applicant.js'
import { submitPostRequest } from '../helpers/server.js'
import application from '../../../__mock-data__/test-application.js'
import * as taskListUtil from '../../../journey-validation/task-list-generator.js'
import checkAndSubmit from '../../../routes/land/check-and-submit.js'

const url = constants.routes.CHECK_AND_SUBMIT
jest.mock('../../../utils/http.js')
const postOptions = {
  url,
  payload: {
    termsAndConditionsConfirmed: 'Yes'
  }
}
const auth = {
  credentials: {
    account: applicant
  }
}

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let checkAndSubmitGet

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
      },
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    checkAndSubmitGet = require('../../../routes/land/check-and-submit.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      redisMap.set(constants.redisKeys.APPLICATION_REFERENCE, '')

      const session = applicationSession()

      session.set(constants.redisKeys.CONTACT_ID, 'mock contact ID')
      session.set(constants.redisKeys.APPLICATION_TYPE, 'mock application type')
      session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150001')
      session.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'Yes')
      session.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['Planning Authority 1'])
      session.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
        {
          location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc',
          fileSize: 0.01,
          fileType: 'application/msword',
          id: '1'

        },
        {
          location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement1.pdf',
          fileSize: 0.01,
          fileType: 'application/pdf',
          id: '2'
        }
      ])
      session.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, '2020-03-11T00:00:00.000Z')
      session.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, '2024-03-11T00:00:00.000Z')
      session.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
        organisationName: 'org1',
        type: 'organisation'
      }, {
        firstName: 'Crishn',
        middleNames: '',
        lastName: 'P',
        emailAddress: 'me@me.com',
        type: 'individual'
      }])
      session.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
        responsibleBodyName: 'test1'
      },
      {
        responsibleBodyName: 'test2'
      }])
      session.set(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED, 'Yes')

      const request = {
        yar: session,
        auth
      }

      jest.spyOn(taskListUtil, 'getTaskListWithStatusCounts').mockReturnValue({ canSubmit: true })

      await checkAndSubmitGet.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.CHECK_AND_SUBMIT)
    })

    it('should redirect to REGISTER_LAND_TASK_LIST if application progress is not complete', async () => {
      const request = {
        yar: redisMap
      }

      jest.spyOn(taskListUtil, 'getTaskListWithStatusCounts').mockReturnValue({ canSubmit: false })

      await checkAndSubmitGet.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })

    it('should redirect to START if APPLICATION_REFERENCE is null', async () => {
      redisMap.set(constants.redisKeys.APPLICATION_REFERENCE, null)

      const request = {
        yar: redisMap
      }

      jest.spyOn(taskListUtil, 'getTaskListWithStatusCounts').mockReturnValue({ canSubmit: true })

      await checkAndSubmitGet.default[0].handler(request, h)
      expect(viewResult).toEqual('/')
    })
  })

  describe('POST', () => {
    it('Should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

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

          const payload = { termsAndConditionsConfirmed: 'Yes' }
          await postHandler({ yar: session, auth, payload }, h)
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
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            throw new Error('test error')
          })

          const payload = { termsAndConditionsConfirmed: 'Yes' }
          await expect(postHandler({ yar: session, auth, payload })).rejects.toThrow('test error')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should handle postJson failure gracefully', async () => {
      const errorMock = new Error('Failed postJson call')
      const http = require('../../../utils/http.js')
      http.postJson.mockRejectedValueOnce(errorMock)

      const session = applicationSession()
      const { handler } = checkAndSubmit.find(route => route.method === 'POST')

      const payload = { termsAndConditionsConfirmed: 'Yes' }
      await expect(handler({ yar: session, auth, payload })).rejects.toEqual(errorMock)
    })

    it('Should throw an error page if validation fails for application', done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

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

          const payload = { termsAndConditionsConfirmed: 'Yes' }
          await expect(postHandler({ yar: session, auth: authCopy, payload }, h)).rejects.toThrow('ValidationError: "landownerGainSiteRegistration.applicant.id" is not allowed to be empty')
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it('Should not fail if not is-agent and no written authoristation is provided', async () => {
      const sessionData = JSON.parse(application.dataString)
      sessionData['is-agent'] = 'no'
      delete sessionData['written-authorisation-location']
      delete sessionData['written-authorisation-file-size']
      delete sessionData['written-authorisation-file-type']
      await submitPostRequest(postOptions, 302, sessionData)
    })

    it('Should fail if agent and no written authorisation is provided', async () => {
      const sessionData = JSON.parse(application.dataString)
      delete sessionData['written-authorisation-location']
      delete sessionData['written-authorisation-file-size']
      delete sessionData['written-authorisation-file-type']
      await submitPostRequest(postOptions, 500, sessionData)
    })

    it('Should display an error message if user has not confirmed reading terms and conditions', done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

          let viewResult = ''
          const h = {
            view: (view) => {
              viewResult = view
            }
          }

          const payload = { termsAndConditionsConfirmed: undefined }
          await postHandler({ yar: session, auth, payload }, h)
          expect(viewResult).toEqual(constants.views.CHECK_AND_SUBMIT)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
