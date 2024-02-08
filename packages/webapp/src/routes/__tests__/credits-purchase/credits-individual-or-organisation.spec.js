import { submitGetRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
const url = creditsPurchaseConstants.routes.ESTIMATOR_CREDITS_INDIVIDUAL_ORG

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
