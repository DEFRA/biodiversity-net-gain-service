import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ALLOCATION_METRIC_NO

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
