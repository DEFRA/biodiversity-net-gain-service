import applicationSession from '../../../__mocks__/application-session.js'
import checkAndSubmit from '../../../routes/land/check-and-submit.js'
import constants from '../../../utils/constants.js'
import applicant from '../../../__mocks__/applicant.js'
import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_AND_SUBMIT
jest.mock('../../../utils/http.js')

const auth = {
  credentials: {
    account: applicant
  }
}
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'
describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const session = applicationSession()
          let viewResult, contextResult
          const getHandler = checkAndSubmit[0].handler
          session.set(constants.redisKeys.CONTACT_ID, 'mock contact ID')
          session.set(constants.redisKeys.APPLICATION_TYPE, 'mock application type')
          session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
          session.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'Yes')
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
          session.set(constants.redisKeys.HABITAT_PLAN_LOCATION, mockDataPath)
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
          // let viewArgs = ''
          // let redirectArgs = ''
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }

          await getHandler({ yar: session, auth }, h)
          expect(viewResult).toEqual(constants.views.CHECK_AND_SUBMIT)
          expect(contextResult.application).not.toBeUndefined()
          expect(typeof contextResult.boolToYesNo).toEqual('function')
          expect(typeof contextResult.dateToString).toEqual('function')
          expect(typeof contextResult.hideClass).toEqual('function')
          expect(contextResult.hideConsent).toEqual(false)
          expect(contextResult.routes).not.toBeUndefined()
          expect(contextResult.changeLandownersHref).toEqual(constants.routes.ADD_LANDOWNERS)
          expect(contextResult.legalAgreementType).toEqual('Planning obligation (section 106 agreement)')
          expect(contextResult.legalAgreementFileNames).toEqual('legal-agreement.doc<br>legal-agreement1.pdf')
          expect(contextResult.responsibleBodies).toEqual('test1,test2')
          expect(contextResult.HabitatWorksStartDate).toEqual('11 March 2020')
          expect(contextResult.HabitatWorksEndDate).toEqual('11 March 2024')
          expect(contextResult.habitatPlanSeperateDocumentYesNo).toEqual('Yes')

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
          authCopy.credentials.account.idTokenClaims.lastName = ''

          await expect(postHandler({ yar: session, auth: authCopy }, h)).rejects.toThrow('ValidationError: "landownerGainSiteRegistration.applicant.lastName" is not allowed to be empty')
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
