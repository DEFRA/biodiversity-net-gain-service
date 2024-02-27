import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICATION_LIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${creditsPurchaseConstants.views.CREDITS_PURCHASE_APPLICATION_LIST} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
