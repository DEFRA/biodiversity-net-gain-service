import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASKLIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${creditsPurchaseConstants.views.CREDITS_PURCHASE_TASKLIST} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
