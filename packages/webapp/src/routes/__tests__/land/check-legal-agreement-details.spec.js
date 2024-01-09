import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe('Land boundary upload controller tests', () => {
  let redisMap
  beforeEach(() => {
    redisMap = new Map()
    redisMap.set(constants.redisKeys.CONTACT_ID, 'mock contact ID')
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, 'mock application type')
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
    redisMap.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'Yes')
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
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
    redisMap.set(constants.redisKeys.HABITAT_PLAN_LOCATION, mockDataPath)
    redisMap.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, '2020-03-11T00:00:00.000Z')
    redisMap.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, '2020-03-11T00:00:00.000Z')
    redisMap.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['Planning Authority 1'])
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
      organisationName: 'org1',
      type: 'organisation'
    }, {
      firstName: 'Crishn',
      middleNames: '',
      lastName: 'P',
      emailAddress: 'me@me.com',
      type: 'individual'
    }])
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
      responsibleBodyName: 'test1'
    },
    {
      responsibleBodyName: 'test2'
    }])
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, `${mockDataPath}/legal-agreement.pdf`)
          redisMap.set(constants.redisKeys.HABITAT_PLAN_LOCATION, `${mockDataPath}/habitat-plan.pdf`)
          redisMap.set(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED, 'Yes')
          const request = {
            yar: redisMap
          }
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }

          await legalAgreementDetails.default[0].handler(request, h)
          expect(viewResult).toEqual(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS)
          expect(contextResult.legalAgreementType).toEqual('Planning obligation (section 106 agreement)')
          expect(contextResult.legalAgreementFileNames).toEqual('legal-agreement.doc<br>legal-agreement1.pdf')
          expect(contextResult.responsibleBodies).toEqual('test1<br>test2')
          expect(contextResult.landowners).toEqual('org1<br>Crishn P (me@me.com)')
          expect(contextResult.habitatPlanIncludedLegalAgreementYesNo).toEqual('Yes')
          expect(contextResult.HabitatPlanFileName).toEqual('habitat-plan.pdf')
          expect(contextResult.HabitatWorksStartDate).toEqual('11 March 2020')
          expect(contextResult.HabitatWorksEndDate).toEqual('11 March 2020')
          expect(contextResult.localPlanningAuthorities).toEqual('Planning Authority 1')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it(`should render the ${url.substring(1)} view with some of the missing data`, done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, undefined)
          const request = {
            yar: redisMap
          }
          redisMap.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'No')
          redisMap.set(constants.redisKeys.HABITAT_PLAN_LOCATION, undefined)
          redisMap.set(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY, null)
          redisMap.set(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY, null)
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await legalAgreementDetails.default[0].handler(request, h)
          expect(viewResult).toEqual(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS)
          expect(contextResult.legalAgreementFileNames).toEqual('')
          expect(contextResult.habitatPlanIncludedLegalAgreementYesNo).toEqual('No')
          expect(contextResult.HabitatPlanFileName).toEqual('')
          expect(contextResult.HabitatWorksStartDate).toEqual('Not started yet')
          expect(contextResult.HabitatWorksEndDate).toEqual('No end date')
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
          const request = {
            yar: redisMap
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
