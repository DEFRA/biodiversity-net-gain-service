import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.MANAGE_BIODIVERSITY_GAINS
const creditsPurchaseLink = '<a href="/credits-purchase/check-statutory-biodiversity-credits">Buy statutory biodiversity credits</a>'
const combinedCaseLink = '<a href="/combined-case/combined-case-projects">Combined case projects</a>'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'Y'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself (Mocker user)', enableDev: true })
      expect(resp.payload).toContain('<a href="/developer/development-projects">Record off-site gains</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'N'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself Mock user)', enableDev: false })
      expect(resp.payload).not.toContain('<a href="/developer/development-projects">Record off-site gains</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = undefined
      const resp = await submitGetRequest({ url }, 200, { representing: 'Mock organisation', enableDev: false })
      expect(resp.payload).not.toContain('<a href="/developer/development-projects">Record off-site gains</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY = 'Y'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself (Mocker user)', enableDev: true })
      expect(resp.payload).toContain(creditsPurchaseLink)
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY = 'N'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself Mock user)', enableDev: false })
      expect(resp.payload).not.toContain(creditsPurchaseLink)
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY = undefined
      const resp = await submitGetRequest({ url }, 200, { representing: 'Mock organisation', enableDev: false })
      expect(resp.payload).not.toContain(creditsPurchaseLink)
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY = 'Y'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself (mock user)', enableDev: true })
      expect(resp.payload).toContain(combinedCaseLink)
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY = 'N'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself Mock user)', enableDev: false })
      expect(resp.payload).not.toContain(combinedCaseLink)
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY = undefined
      const resp = await submitGetRequest({ url }, 200, { representing: 'Mock organisation', enableDev: false })
      expect(resp.payload).not.toContain(combinedCaseLink)
    })
  })
})
