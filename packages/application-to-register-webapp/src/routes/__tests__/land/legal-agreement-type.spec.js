import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
const url = '/land/legal-agreement-type'

describe(url, () => {
  const redisMap = new Map()

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view without any selection`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })

    it(`should render the ${url.substring(1)} view with conservation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, 'Conservation covenant')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
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
        expect(viewResult).toEqual('land/legal-agreement-type')
        expect(contextResult.conservationType).toEqual(true)
      })
    })

    it(`should render the ${url.substring(1)} view with planning selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, 'Planning obligation (section 106 agreement)')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
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
        expect(viewResult).toEqual('land/legal-agreement-type')
        expect(contextResult.planningObligationType).toEqual(true)
      })
    })

    it(`should render the ${url.substring(1)} view with dont have selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, 'I do not have a legal agreement')
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/legal-agreement-type')
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
        expect(viewResult).toEqual('land/legal-agreement-type')
        expect(contextResult.dontHave).toEqual(true)
      })
    })
  })

  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('should allow the choice of conservation covenant legal agreement', async () => {
      postOptions.payload.legalAgrementType = 'Conservation covenant'
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
    })

    it('should allow the choice of Planning obligation (section 106 agreement) legal agreement', async () => {
      postOptions.payload.legalAgrementType = 'Planning obligation (section 106 agreement)'
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
    })

    it('should allow the choice of I do not have a legal agreement legal agreement', async () => {
      postOptions.payload.legalAgrementType = 'I do not have a legal agreement'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
