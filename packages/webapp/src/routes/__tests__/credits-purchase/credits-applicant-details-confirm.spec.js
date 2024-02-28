import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICANT_CONFIRM

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${creditsPurchaseConstants.views.CREDITS_PURCHASE_APPLICANT_CONFIRM} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
