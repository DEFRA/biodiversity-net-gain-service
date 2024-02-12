import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CREDITS_DEFRA_ACCOUNT_NOT_LINKED

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.CREDITS_DEFRA_ACCOUNT_NOT_LINKED} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
