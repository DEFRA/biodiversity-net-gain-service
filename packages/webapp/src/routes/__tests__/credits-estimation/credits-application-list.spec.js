import constants from '../../../credits/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.ESTIMATOR_CREDITS_APPLICATION_LIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_APPLICATION_LIST} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
