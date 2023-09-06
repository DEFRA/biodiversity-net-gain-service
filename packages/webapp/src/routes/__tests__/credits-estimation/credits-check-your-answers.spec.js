import constants from '../../../credits/constants.js'

import { submitGetRequest } from '../helpers/server.js'
const url = constants.routes.ESTIMATOR_CREDITS_CHECK_YOUR_ANSWERS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
