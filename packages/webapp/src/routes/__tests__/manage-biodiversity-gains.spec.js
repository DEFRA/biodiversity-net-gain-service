import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
const url = constants.routes.MANAGE_BIODIVERSITY_GAINS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url }, 200, { enableDev: process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y' })
    })
  })
})
