import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
const url = constants.routes.MANAGE_BIODIVERSITY_GAINS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'Y'
      const resp = await submitGetRequest({ url }, 200, { enableDev: true })
      expect(resp.payload).toContain('<a href="/developer/development-projects">Development projects</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'N'
      const resp = await submitGetRequest({ url }, 200, { enableDev: false })
      expect(resp.payload).not.toContain('<a href="/developer/development-projects">Development projects</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = undefined
      const resp = await submitGetRequest({ url }, 200, { enableDev: false })
      expect(resp.payload).not.toContain('<a href="/developer/development-projects">Development projects</a>')
    })
  })
})
