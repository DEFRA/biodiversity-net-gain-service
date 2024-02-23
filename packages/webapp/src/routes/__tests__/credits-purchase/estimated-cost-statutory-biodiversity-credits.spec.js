import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST
const mockCostCalculation = {
  tierCosts: [
    { unitAmount: 2.3, tier: 'a1', cost: 96599.99999999999 },
    { unitAmount: 0, tier: 'a2', cost: 0 },
    { unitAmount: 0, tier: 'a3', cost: 0 },
    { unitAmount: 0, tier: 'a4', cost: 0 },
    { unitAmount: 0.4, tier: 'a5', cost: 260000 },
    { unitAmount: 0, tier: 'h', cost: 0 },
    { unitAmount: 0, tier: 'w', cost: 0 }
  ],
  total: 356600
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with correct values and formatting`, async () => {
      const sessionData = {}
      sessionData[creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION] = mockCostCalculation
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('£356,600')
      expect(res.payload).toContain('£96,600')
    })

    it('should redirect to the credits selection page if costs haven\'t been calculated', async () => {
      const res = await submitGetRequest({ url }, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION)
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

    it('Should continue journey when continue clicked', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/')
    })
  })
})
