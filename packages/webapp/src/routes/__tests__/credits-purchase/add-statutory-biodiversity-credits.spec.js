import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const res = await submitGetRequest({ url })
      expect(res.statusCode).toBe(200)
    })

    it('should render the view with previous values if in cache', async () => {
      const sessionData = {
        [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION]: {
          tierCosts: [{ tier: 'exampleTier', unitAmount: 50 }]
        },
        errorMessages: null,
        errorList: null
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('50')
    })

    it('should render the view with the correct error message when no input is provided', async () => {
      const sessionData = {
        errorList: [{ text: 'Enter at least one credit from the metric up to 2 decimal places, like 23.75' }]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('should render the view with the correct error messages when validation fails', async () => {
      const sessionData = {
        [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION]: {
          tierCosts: [{ tier: 'exampleTier', unitAmount: 5012345678901 }]
        },
        errorList: [{ text: 'Number of credits must be 10 characters or fewer' }]
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Number of credits must be 10 characters or fewer')
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

    it('should continue to the cost page when valid input is provided', async () => {
      postOptions.payload = { a1: '1', a2: '', a3: '', a4: '', a5: '', h: '', w: '' }
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST)
    })

    it('should not continue journey if validation fails due to long input', async () => {
      postOptions.payload = { a1: '12345678910', a2: '', a3: '', a4: '', a5: '', h: '', w: '' }
      const res = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION)
    })

    it('should not continue journey if no input is provided', async () => {
      postOptions.payload = { a1: '', a2: '', a3: '', a4: '', a5: '', h: '', w: '' }
      const res = await submitPostRequest(postOptions, 302, null, { expectedNumberOfPostJsonCalls: 0 })
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION)
    })
  })
})
