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
      expect(res.payload).toContain('50') // Check for the unitAmount rendered
    })

    it('should render the view with the correct error messages when validation fails', async () => {
      const sessionData = {
        errorMessages: [{ text: 'Enter at least one credit from the metric up to 2 decimal places, like 23.75' }],
        errorList: [{ text: 'Number of credits must be 10 characters or fewer', href: '#inputField' }]
      }
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
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
      postOptions.payload = { inputField: '25.00' }
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST)
    })

    it('should fail and redirect back if validation fails', async () => {
      postOptions.payload = { inputField: 'invalidInput' }
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION)
    })
  })
})
