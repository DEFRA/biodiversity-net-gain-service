import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsEstimationConstants from '../../../utils/credits-estimation-constants.js'

const url = creditsEstimationConstants.routes.ESTIMATOR_CREDITS_TIER
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
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should render the view with previous values if in cache', async () => {
      const sessionData = {}
      sessionData[creditsEstimationConstants.redisKeys.ESTIMATOR_CREDITS_CALCULATION] = mockCostCalculation
      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('2.3')
      expect(res.payload).toContain('0.4')
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

    it('Should continue journey if at least one credit is entered', async () => {
      postOptions.payload.a2 = '1.2'
      const res = await submitPostRequest(postOptions, 302, {}, { expectedNumberOfPostJsonCalls: 0 })
      expect(res.headers.location).toEqual(creditsEstimationConstants.routes.ESTIMATOR_CREDITS_COST)
    })

    it('Should fail journey if no credits are entered', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('Should fail journey if no credits above 0 are entered', async () => {
      postOptions.payload.a2 = '0'
      postOptions.payload.a3 = '0.0'
      postOptions.payload.a4 = '0.00'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('Should fail journey if more than two decimal places entered for a credit', async () => {
      postOptions.payload.a2 = '1.22222'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('Should fail journey if credit entered is not a number', async () => {
      postOptions.payload.a2 = 'geoff'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('Should fail journey if credit entered is more than 10 characters', async () => {
      postOptions.payload.a2 = '123456789012345678901234567890123456789012345678901234567890'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Number of credits must be 10 characters or fewer')
    })
  })
})
