import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.CREDITS_TASKLIST

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${constants.views.CREDITS_TASKLIST} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
