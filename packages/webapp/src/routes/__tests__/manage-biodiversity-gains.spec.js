import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const url = constants.routes.MANAGE_BIODIVERSITY_GAINS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'Y'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself (Mocker user)', enableDev: true }, { expectedNumberOfPostJsonCalls: 1 })
      expect(resp.payload).toContain('<a href="/developer/development-projects">Development projects</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'N'
      const resp = await submitGetRequest({ url }, 200, { representing: 'Myself Mock user)', enableDev: false }, { expectedNumberOfPostJsonCalls: 1 })
      expect(resp.payload).not.toContain('<a href="/developer/development-projects">Development projects</a>')
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = undefined
      const resp = await submitGetRequest({ url }, 200, { representing: 'Mock organisation', enableDev: false }, { expectedNumberOfPostJsonCalls: 1 })
      expect(resp.payload).not.toContain('<a href="/developer/development-projects">Development projects</a>')
    })

    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const expectedURL = creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICATION_LIST
          const expectedReturn = [{
            applicationReference: 'mock application reference 1',
            lastUpdated: new Date(),
            applicationStatus: 'SUBMITTED'
          }, {
            applicationReference: 'mock application reference 2',
            lastUpdated: new Date(),
            applicationStatus: 'SUBMITTED'
          }]
          jest.resetAllMocks()
          jest.mock('../../utils/http.js')
          const http = require('../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return expectedReturn
          })
          const res = await submitGetRequest({ url }, 200, null, { expectedNumberOfPostJsonCalls: 1 })
          expect(res.payload).toContain(expectedURL)

          done()
        } catch (err) {
          done(err)
        }
      })
    })

    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const expectedURL = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST
          const expectedReturn = [{
            applicationReference: 'mock application reference 1',
            lastUpdated: new Date(),
            applicationStatus: 'IN PROGRESS'
          }, {
            applicationReference: 'mock application reference 2',
            lastUpdated: new Date(),
            applicationStatus: 'SUBMITTED'
          }]

          const http = require('../../utils/http.js')
          const helpers = require('../../utils/helpers.js')

          http.postJson = jest.fn().mockImplementation(() => {
            return expectedReturn
          })

          helpers.getCreditsRedirectURL = jest.fn().mockReturnValue(() => {
            return expectedURL
          })
          const res = await submitGetRequest({ url }, 200, null, { expectedNumberOfPostJsonCalls: 1 })
          expect(res.payload).toContain(expectedURL)

          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
