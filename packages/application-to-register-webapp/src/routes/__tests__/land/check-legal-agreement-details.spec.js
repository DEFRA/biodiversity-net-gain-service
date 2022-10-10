import constants from '../../../utils/constants.js'

const url = '/land/check-legal-agreement-details'
const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'

describe(url, () => {
  const rdisMap = new Map()
  beforeEach(() => {
    rdisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, 'Test type')
    rdisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, mockDataPath)
    rdisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_DAY, '01')
    rdisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_MONTH, '02')
    rdisMap.set(constants.redisKeys.LEGAL_AGREEMENT_START_YEAR, '2022')
    rdisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {
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
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
        const request = {
          yar: rdisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual('land/check-legal-agreement-details')
        expect(contextResult.legalAgreementType).toEqual('Test type')
        expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
        expect(contextResult.legalAgreementStartDate).toEqual('1 Feb 2022')
      })
    })
  })
  describe('POST', () => {
    it('should continue with the flow', async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
        const request = {
          yar: rdisMap
        }
        const h = {
          redirect: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[1].handler(request, h)
        expect(viewResult).toEqual('/land/check-legal-agreement-details')
        expect(contextResult.legalAgreementType).toEqual('Test type')
        expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
        expect(contextResult.legalAgreementStartDate).toEqual('1 Feb 2022')
      })
    })
  })
})
