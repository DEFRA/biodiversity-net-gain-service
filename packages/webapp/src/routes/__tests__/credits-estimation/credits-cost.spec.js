import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
const url = constants.routes.ESTIMATOR_CREDITS_COST

const calculationResult = {
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

const redisCalculation = {
  [constants.redisKeys.ESTIMATOR_CREDITS_CALCULATION]: calculationResult
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_COST} view with correct content`, async () => {
      const res = await submitGetRequest({ url }, 200, redisCalculation)
      expect(res.result).toContain(
        calculationResult.total.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 })
      )
    })

    it(`should redirect to the ${constants.routes.ESTIMATOR_CREDITS_TIER} route if no session data}`, async () => {
      const res = await submitGetRequest({ url }, 302)
      expect(res.headers.location).toEqual(constants.routes.ESTIMATOR_CREDITS_TIER)
    })
  })
})
