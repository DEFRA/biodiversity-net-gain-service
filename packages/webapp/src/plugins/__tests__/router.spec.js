import plugin from '../router'

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
    process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_LAND_BOUNDARY_UPLOAD = 'Y'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL = 'Y'

    const { default: disabledRoutes } = require('../../utils/disabled-routes-constants.js')
    expect(disabledRoutes).toStrictEqual({
      CHECK_GEOSPATIAL_FILE: 'land/check-geospatial-file',
      UPLOAD_GEOSPATIAL_LAND_BOUNDARY: 'land/upload-geospatial-file',
      GEOSPATIAL_LAND_BOUNDARY: 'land/geospatial-land-boundary',
      CHOOSE_LAND_BOUNDARY_UPLOAD: 'land/choose-land-boundary-upload',
      DEVELOPER_EMAIL_ENTRY: 'developer/email-entry'
    })
  })

  it('should not return disabled routes if env variables are not defined or value is N', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_LAND_BOUNDARY_UPLOAD = 'N'
    process.env.ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL = 'N'
    jest.mock('../../utils/disabled-routes-constants')

    const { default: disabledRoutes } = require('../../utils/disabled-routes-constants.js')
    expect(disabledRoutes).toStrictEqual({})
  })
})
