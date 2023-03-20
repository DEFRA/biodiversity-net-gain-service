import constants from '../../../utils/constants.js'
import { submitGetRequest } from '../helpers/server.js'

const url = constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
