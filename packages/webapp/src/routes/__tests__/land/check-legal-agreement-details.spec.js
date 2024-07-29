import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'
import applicationSession from '../../../__mocks__/application-session.js'
const url = constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
describe('Legal Agreement controller tests', () => {
  const redisMap = applicationSession()

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          const session = applicationSession()

          const request = {
            yar: session
          }
          // eslint-disable-next-line no-unused-vars
          let redirectArgs = ''
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }
          await legalAgreementDetails.default[0].handler(request, h)
          expect(viewResult).toEqual(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS)
          expect(contextResult.legalAgreementType).toEqual('Conservation covenant')
          expect(contextResult.legalAgreementFileNames).toEqual('legal-agreement.doc<br>legal-agreement1.pdf')
          expect(contextResult.responsibleBodies).toEqual('test1<br>test2')
          expect(contextResult.landowners).toEqual('org1 (me@me.com)<br>Crishn P (me@me.com)')
          expect(contextResult.habitatPlanIncludedLegalAgreementYesNo).toEqual('Yes')
          expect(contextResult.HabitatPlanFileName).toEqual('habitat-plan.doc')
          expect(contextResult.HabitatWorksStartDate).toEqual('01 January 2022')
          expect(contextResult.HabitatWorksEndDate).toEqual('01 January 2023')
          expect(contextResult.localPlanningAuthorities).toEqual('County Durham LPA<br>Secretary of State')
          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it(`should render the ${url.substring(1)} view with some of the missing data`, done => {
      jest.isolateModules(async () => {
        try {
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, undefined)
          let redirectArgs = ''
          const request = {
            yar: redisMap
          }
          redisMap.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'No')
          redisMap.set(constants.redisKeys.HABITAT_PLAN_LOCATION, undefined)
          redisMap.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, null)
          redisMap.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, null)
          const h = {
            redirect: (...args) => {
              redirectArgs = args
            }
          }
          await legalAgreementDetails.default[0].handler(request, h)
          expect(redirectArgs).toEqual([constants.routes.REGISTER_LAND_TASK_LIST])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
  describe('POST', () => {
    it('should continue with the flow', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
          const request = {
            yar: redisMap,
            path: legalAgreementDetails.default[1].path
          }
          const h = {
            redirect: (view, context) => {
              viewResult = view
            }
          }
          await legalAgreementDetails.default[1].handler(request, h)
          expect(viewResult).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
