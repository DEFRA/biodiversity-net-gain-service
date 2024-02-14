import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CREDITS_APPLICATION_LIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.CREDITS_APPLICATION_LIST} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
