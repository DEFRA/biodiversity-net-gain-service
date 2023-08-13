import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
const url = constants.routes.ESTIMATOR_CREDITS_COST

const mockCalculation = {
  tierCosts: [
    { tier: 'a1', unitAmount: 0, cost: 0 },
    { tier: 'a2', unitAmount: 0, cost: 0 },
    { tier: 'a3', unitAmount: 0, cost: 0 },
    { tier: 'a4', unitAmount: 0, cost: 0 },
    { tier: 'a5', unitAmount: 0, cost: 0 },
    { tier: 'h', unitAmount: 1.2, cost: 52800 },
    { tier: 'w', unitAmount: 0, cost: 0 }
  ],
  total: 52800
}

const mockRedisCalculation = { [constants.redisKeys.ESTIMATOR_CREDITS_CALCULATION]: mockCalculation }

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_COST} view with correct content`, async () => {
      const response = await submitGetRequest({ url }, 200, mockRedisCalculation)
      expect(response.result).toContain(
        mockCalculation.total.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 })
      )
    })

    it(`should redirect to the ${constants.routes.ESTIMATOR_CREDITS_TIER} route if no session data}`, async () => {
      const response = await submitGetRequest({ url }, 302)
      expect(response.headers.location).toEqual(constants.routes.ESTIMATOR_CREDITS_TIER)
    })
  })
})
