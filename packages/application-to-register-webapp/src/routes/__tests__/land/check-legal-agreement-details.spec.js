import constants from '../../../utils/constants.js'

const url = '/land/check-legal-agreement-details'
const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'

describe(url, () => {
  const redisMap = new Map()
  beforeEach(() => {
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, 'Test type')
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
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
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
        expect(viewResult).toEqual('land/check-legal-agreement-details')
        expect(contextResult.legalAgreementType).toEqual('Test type')
        expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
        expect(contextResult.legalAgreementStartDate).toEqual('11 Mar 2020')
      })
    })
  })
  describe('POST', () => {
    it('should continue with the flow', async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
        const request = {
          yar: redisMap
        }
        const h = {
          redirect: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[1].handler(request, h)
        expect(viewResult).toEqual('/land/register-land-task-list')
        expect(contextResult.legalAgreementType).toEqual('Test type')
        expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
        expect(contextResult.legalAgreementStartDate).toEqual('11 Mar 2020')
      })
    })
    // it('should continue with the flow with other party role', async () => {
    //   jest.isolateModules(async () => {
    //     let viewResult, contextResult
    //     const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
    //     redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, {
    //       organisations: [{
    //         index: 1,
    //         value: 'Test'
    //       }],
    //       roles: [{
    //         otherPartyName: 'County Council',
    //         organisationIndex: 1,
    //         rowIndex: 0,
    //         county_council: true
    //       }]
    //     })
    //     const request = {
    //       yar: redisMap
    //     }
    //     const h = {
    //       redirect: (view, context) => {
    //         viewResult = view
    //         contextResult = context
    //       }
    //     }
    //     await legalAgreementDetails.default[1].handler(request, h)
    //     expect(viewResult).toEqual('land/register-land-task-list')
    //     expect(contextResult.legalAgreementType).toEqual('Test type')
    //     expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
    //     expect(contextResult.legalAgreementStartDate).toEqual('11 Mar 2020')
    //   })
    // })
    it('should continue with the flow with other party role', async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
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
        const request = {
          yar: redisMap
        }
        const h = {
          redirect: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[1].handler(request, h)
        expect(viewResult).toEqual('/land/register-land-task-list')
        expect(contextResult.legalAgreementType).toEqual('Test type')
        expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
        expect(contextResult.legalAgreementStartDate).toEqual('11 Mar 2020')
      })
    })
    it('should continue with the flow with other party role name', async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-legal-agreement-details.js')
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
        const request = {
          yar: redisMap
        }
        const h = {
          redirect: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[1].handler(request, h)
        expect(viewResult).toEqual('/land/register-land-task-list')
        expect(contextResult.legalAgreementType).toEqual('Test type')
        expect(contextResult.legalAgreementFileName).toEqual('legal-agreements')
        expect(contextResult.legalAgreementStartDate).toEqual('11 Mar 2020')
      })
    })
  })
})
