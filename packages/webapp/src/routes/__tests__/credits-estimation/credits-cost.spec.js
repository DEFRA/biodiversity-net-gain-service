import { submitGetRequest } from '../helpers/server.js'
import creditsConstants from '../../../utils/credits-estimation-constants.js'

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

    it(`should render header link with href set to ${creditsConstants.routes.ESTIMATOR_CREDITS_TIER}`, async () => {
      const res = await submitGetRequest({ url }, 200, redisCalculation)
      const escapeHref = creditsConstants.routes.ESTIMATOR_CREDITS_TIER.replace(/\//g, '\\$&')
      const pattern = new RegExp(`<a\\s+href="${escapeHref}"\\s+class="govuk-header__link govuk-header__service-name">\\s+Estimate the cost of statutory biodiversity credits\\s+</a>`)
      expect(res.payload.replace(/[\s\n\r]{2,}/g, ' ')).toMatch(
        new RegExp(pattern)
      )
    })
  })
})
