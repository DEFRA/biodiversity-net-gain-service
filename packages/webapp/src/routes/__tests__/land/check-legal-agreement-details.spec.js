import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe('Land boundary upload controller tests', () => {
  let redisMap
  beforeEach(() => {
    redisMap = new Map()
    // Set the contact ID and application type to increase test coverage.
    redisMap.set(constants.redisKeys.CONTACT_ID, 'mock contact ID')
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, 'mock application type')
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
          redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {
            organisations: [{
              index: 1,
              value: 'Test'
            }],
            roles: [{
              otherPartyName: 'County Council',
              organisationIndex: 1,
              rowIndex: 0,
              county_council: true
            }]
          })
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
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {
          organisations: [{
            index: 1,
            value: 'Test'
          }],
          roles: [{
            otherPartyName: 'Other party role',
            organisationIndex: 1,
            rowIndex: 0
          }]
        })
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
        expect(request.yar.get('legal-agreement-parties').organisations[0].value).toBe('Test')
        expect(request.yar.get('legal-agreement-parties').roles[0].otherPartyName).toBe('Other party role')
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
