import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${creditsPurchaseConstants.views.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
