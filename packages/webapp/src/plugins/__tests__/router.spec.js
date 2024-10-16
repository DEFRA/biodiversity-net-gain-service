import plugin from '../router'
import developerConstants from '../../utils/developer-constants'
import creditsEstimationConstants from '../../utils/credits-estimation-constants.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import combinedCaseConstants from '../../utils/combined-case-constants.js'

const ORIGINAL_ENV = process.env
let server

describe('Routes', () => {
  afterEach(async () => {
    try {
      if (server) {
        await server.stop()
      }
    } finally {
      process.env = { ...ORIGINAL_ENV }
    }
  })
  it('is plugin', () => {
    expect(plugin.name).toBe('router')
    expect(typeof plugin).toBe('function')
  })

  it('should return disable routes if env variables are defined or value is Y', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_LAND_BOUNDARY_UPLOAD = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY = 'Y'

    const { default: disabledRoutes } = require('../../utils/disabled-routes-constants.js')
    expect(disabledRoutes).toStrictEqual({
      DEVELOPER_EMAIL_ENTRY: 'developer/email-entry',
      ...developerConstants.routes,
      ...creditsEstimationConstants.routes,
      ...creditsPurchaseConstants.routes,
      ...combinedCaseConstants.routes
    })
  })

  it('should not return disabled routes if env variables are not defined or value is N', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_LAND_BOUNDARY_UPLOAD = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_CREDIT_PURCHASE_JOURNEY = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_COMBINED_CASE_JOURNEY = 'N'
    jest.mock('../../utils/disabled-routes-constants')

    const { default: disabledRoutes } = require('../../utils/disabled-routes-constants.js')
    expect(disabledRoutes).toStrictEqual({})
  })
})
