import serverOptions from '../../__mocks__/server-options.js'
import { startServer } from '../../routes/__tests__/helpers/server'
import plugin from '../router'

const ORIGINAL_ENV = process.env
let server

describe('Routes', () => {
  const emailEntry = '/developer/email-entry'

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

  it('should disabled routes if env variable is defined with N', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL = 'N'
    server = await startServer({ ...serverOptions, port: 3001 })

    await checkIfRouteExists(emailEntry, 404)
  })

  it('should not disabled routes if env variable is defined with Y', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_ADDITIONAL_EMAIL = 'Y'
    server = await startServer({ ...serverOptions, port: 3001 })

    await checkIfRouteExists(emailEntry)
  })
})

const checkIfRouteExists = async (route, statusCode) => {
  const response = await server.inject({
    method: 'GET',
    url: route
  })
  expect(response.statusCode).toEqual(statusCode || 200)
}
