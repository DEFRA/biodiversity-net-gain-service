import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
