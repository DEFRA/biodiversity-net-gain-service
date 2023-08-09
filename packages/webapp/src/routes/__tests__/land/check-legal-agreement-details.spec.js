import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe('Land boundary upload controller tests', () => {
  let redisMap
  beforeEach(() => {
    redisMap = new Map()
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, mockDataPath)
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY, '2020-03-11T00:00:00.000Z')
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {
      organisations: [{
        index: 1,
        value: 'Test'
      }],
      roles: [{
        value: 'County Council',
        organisationIndex: 1,
        rowIndex: 0,
        county_council: true
      }]
    })
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, `${mockDataPath}/legal-agreement.pdf`)
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
          expect(contextResult.legalAgreementFileName).toEqual('legal-agreement.pdf')
          expect(contextResult.legalAgreementStartDate).toEqual('2020-03-11T00:00:00.000Z')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it(`should render the ${url.substring(1)} view with other party role`, done => {
      jest.isolateModules(async () => {
        try {
          let viewResult, contextResult
          const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, undefined)
          const request = {
            yar: redisMap
          }
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, [{
            organisationName: 'org1',
            organisationRole: 'Developer',
            organisationOtherRole: 'undefined'
          },
          {
            organisationName: 'org2',
            organisationRole: 'Landowner',
            organisationOtherRole: 'undefined'
          }])
          const h = {
            view: (view, context) => {
              viewResult = view
              contextResult = context
            }
          }
          await legalAgreementDetails.default[0].handler(request, h)
          expect(viewResult).toEqual(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS)
          expect(contextResult.legalAgreementType).toEqual('Planning obligation (section 106 agreement)')
          expect(contextResult.legalAgreementFileName).toEqual('')
          expect(contextResult.legalAgreementStartDate).toEqual('2020-03-11T00:00:00.000Z')
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
  it('should continue with the flow with other party role', done => {
    jest.isolateModules(async () => {
      try {
        let viewResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, [{
          organisationName: 'org1',
          organisationRole: 'Developer',
          organisationOtherRole: 'undefined'
        },
        {
          organisationName: 'org2',
          organisationRole: 'Landowner',
          organisationOtherRole: 'undefined'
        }])
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
        expect(request.yar.get('legal-agreement-parties')[0].organisationName).toBe('org1')
        expect(request.yar.get('legal-agreement-parties')[0].otherPartyName).toBe(undefined)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
