import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
const url = constants.routes.ESTIMATOR_CREDITS_INDIVIDUAL_ORG

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
