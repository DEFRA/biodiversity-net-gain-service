import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
const url = constants.routes.MANAGE_BIODIVERSITY_GAINS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y'
      await submitGetRequest({ url }, 200, { enableDev: true })
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'N'
      await submitGetRequest({ url }, 200, { enableDev: false })
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === undefined
      await submitGetRequest({ url }, 200, { enableDev: false })
    })
  })
})
