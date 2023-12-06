import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
import mainConstants from '../../../utils/constants.js'
const url = mainConstants.routes.TEST_CREDITS_ESTIMATION_DATA

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.request.yar.get(constants.redisKeys.ESTIMATOR_CREDITS_CALCULATION)).toEqual(null)
    })
  })
})
