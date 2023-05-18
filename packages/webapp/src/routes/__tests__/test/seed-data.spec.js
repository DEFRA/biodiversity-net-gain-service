import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.TEST_SEED_DATA

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.request.yar.get(constants.redisKeys.FULL_NAME)).toEqual('Test Name')
      expect(response.request.yar.get(constants.redisKeys.EMAIL_VALUE)).toEqual('test@test.com')
    })
  })
})
