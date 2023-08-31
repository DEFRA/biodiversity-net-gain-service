import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
const url = constants.routes.MANAGE_BIODIVERSITY_GAINS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
})
