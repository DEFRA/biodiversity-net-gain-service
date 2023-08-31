import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
const url = constants.routes.ESTIMATOR_CREDITS_TIER

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

const goodPayload = {
  a1: '', a2: '', a3: '', a4: '', a5: '', h: '1.2', w: ''
}

const badPayload = {
  a1: '', a2: '', a3: '', a4: '', a5: '', h: '1.222', w: ''
}

const viewInputValues = {
  a1: 0, a2: 0, a3: 0, a4: 0, a5: 0, h: 1.2, w: 0
}

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_TIER} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${constants.views.ESTIMATOR_CREDITS_TIER} view with correct session content`, async () => {
      const res = await submitGetRequest({ url }, 200, redisCalculation)

      expect(res.request.response.source.context.inputValues).toMatchObject(viewInputValues)
      // The 'h' tier input box should have the value 1.2
      expect(res.result).toContain('value="1.2"')
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

    it(`Should redirect to ${constants.views.ESTIMATOR_CREDITS_COST} if good payload provided`, async () => {
      postOptions.payload = goodPayload
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(constants.routes.ESTIMATOR_CREDITS_COST)
    })

    it('Should show error message if bad payload provided', async () => {
      postOptions.payload = badPayload
      const res = await submitPostRequest(postOptions, 200)
      expect(res.result).toContain('There is a problem')
      expect(res.result).toContain('Enter the number of credits from the metric up to 2 decimal places, like 23.75.')
    })
  })
})
