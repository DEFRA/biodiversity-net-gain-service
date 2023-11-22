import applicationSession from '../../../__mocks__/application-session.js'
import checkAndSubmit from '../../../routes/land/check-and-submit.js'
import constants from '../../../utils/constants.js'
import applicant from '../../../__mocks__/applicant.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import application from '../../../__mock-data__/test-application.js'
const url = constants.routes.CHECK_AND_SUBMIT
jest.mock('../../../utils/http.js')
const postOptions = {
  url,
  payload: {}
}

const auth = {
  credentials: {
    account: applicant
  }
}
describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          let viewResult, contextResult
          const checkAndSubmitview = require('../../../routes/land/check-and-submit.js')
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
          session.set(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY, '2024-03-11T00:00:00.000Z')
          session.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
            organisationName: 'org1',
            type: 'organisation'
          }, {
            firstName: 'Crishn',
            middleNames: '',
            lastName: 'P',
            type: 'individual'
          }])
          session.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
            responsibleBodyName: 'test1'
          },
          {
            responsibleBodyName: 'test2'
          }])

          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await checkAndSubmitview.default[0].handler({ yar: session, auth }, h)
          expect(viewResult).toEqual(constants.views.CHECK_AND_SUBMIT)
          expect(contextResult.application).not.toBeUndefined()
          expect(typeof contextResult.boolToYesNo).toEqual('function')
          expect(typeof contextResult.dateToString).toEqual('function')
          expect(typeof contextResult.hideClass).toEqual('function')
          expect(contextResult.hideConsent).toEqual(false)
          expect(contextResult.routes).not.toBeUndefined()
          expect(contextResult.changeLandownersHref).toEqual(constants.routes.ADD_LANDOWNERS)
          expect(contextResult.legalAgreementType).toEqual('Conservation covenant')
          expect(contextResult.localPlanningAuthorities).toEqual('Planning Authority 1')
          expect(contextResult.legalAgreementFileNames).toEqual('legal-agreement.doc<br>legal-agreement1.pdf')
          expect(contextResult.responsibleBodies).toEqual('test1<br>test2')
          expect(contextResult.HabitatWorksStartDate).toEqual('11 March 2020')
          expect(contextResult.HabitatWorksEndDate).toEqual('11 March 2024')
          expect(contextResult.habitatPlanIncludedLegalAgreementYesNo).toEqual('Yes')

          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it(`should render the ${url.substring(1)} view `, async () => {
      const session = applicationSession()
      session.set(constants.redisKeys.APPLICATION_REFERENCE, null)
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
    it('should redirect to START if APPLICATION_REFERENCE is null', async () => {
      const session = applicationSession()
      session.set(constants.redisKeys.APPLICATION_REFERENCE, null)
      const { handler } = checkAndSubmit.find(route => route.method === 'GET')
      const h = { redirect: jest.fn() }
      await handler({ yar: session }, h)
      expect(h.redirect).toHaveBeenCalledWith(constants.routes.START)
    })
    it(`should render the ${url.substring(1)} view with hideConsent true and no legal agreement files uploaded`, done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          let viewResult, contextResult
          const checkAndSubmitView = require('../../../routes/land/check-and-submit.js')
          session.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, null)
          session.set(constants.redisKeys.LANDOWNERS, [])
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await checkAndSubmitView.default[0].handler({ yar: session, auth }, h)
          expect(viewResult).toEqual(constants.views.CHECK_AND_SUBMIT)
          expect(contextResult.legalAgreementFileNames).toEqual('')
          expect(contextResult.hideConsent).toBeTruthy()
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
          const session = applicationSession()
          const postHandler = checkAndSubmit[1].handler

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
    it('should handle postJson failure gracefully', async () => {
      const errorMock = new Error('Failed postJson call')
      const http = require('../../../utils/http.js')
      http.postJson.mockRejectedValueOnce(errorMock)

      const session = applicationSession()
      const { handler } = checkAndSubmit.find(route => route.method === 'POST')

      await expect(handler({ yar: session, auth })).rejects.toEqual(errorMock)
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

          await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "landownerGainSiteRegistration.applicant.id" is not allowed to be empty')
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
      delete sessionData['written-authorisation-checked']
      await submitPostRequest(postOptions, 302, sessionData)
    })

    it('Should fail if agent and no written authorisation is provided', async () => {
      const sessionData = JSON.parse(application.dataString)
      delete sessionData['written-authorisation-location']
      delete sessionData['written-authorisation-file-size']
      delete sessionData['written-authorisation-file-type']
      delete sessionData['written-authorisation-checked']
      await submitPostRequest(postOptions, 500, sessionData)
    })
  })
})
