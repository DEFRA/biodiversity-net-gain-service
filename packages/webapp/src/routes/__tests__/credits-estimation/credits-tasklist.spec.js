import constants from '../../../credits/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.ESTIMATOR_CREDITS_TASKLIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_TASKLIST} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
