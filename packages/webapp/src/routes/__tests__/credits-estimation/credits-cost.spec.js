import { submitGetRequest } from '../helpers/server.js'
import constants from '../.../../../../utils/constants.js'
import creditsConstants from '../../../credits/constants.js'

const url = creditsConstants.routes.ESTIMATOR_CREDITS_COST

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
  [creditsConstants.redisKeys.ESTIMATOR_CREDITS_CALCULATION]: calculationResult
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${creditsConstants.views.ESTIMATOR_CREDITS_COST} view with correct content`, async () => {
      const res = await submitGetRequest({ url }, 200, redisCalculation)
      expect(res.result).toContain(
        calculationResult.total.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 })
      )
    })

    it(`should redirect to the ${creditsConstants.routes.ESTIMATOR_CREDITS_TIER} route if no session data}`, async () => {
      const res = await submitGetRequest({ url }, 302)
      expect(res.headers.location).toEqual(creditsConstants.routes.ESTIMATOR_CREDITS_TIER)
    })

    it('should redirect to the developer journey task list if a developer journey is in progress', async () => {
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.ALLOCATION)
      const response = await submitGetRequest({ url }, 302, Object.fromEntries(redisMap))
      expect(response.headers.location).toEqual(constants.routes.DEVELOPER_TASKLIST)
    })

    it('should redirect to the landowner journey task list if a landowner journey is in progress', async () => {
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
      const response = await submitGetRequest({ url }, 302, Object.fromEntries(redisMap))
      expect(response.headers.location).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
