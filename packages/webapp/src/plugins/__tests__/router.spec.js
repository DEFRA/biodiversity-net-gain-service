import serverOptions from '../../__mocks__/server-options.js'
import { startServer } from '../../routes/__tests__/helpers/server'
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

  it('should not disable routes if env variable is not defined', async () => {
    process.env.DISABLED_ROUTES = undefined
    server = await startServer({ ...serverOptions, port: 3001 })
    const response = await server.inject({
      method: 'GET',
      url: '/start'
    })
    expect(response.statusCode).toEqual(200)
  })

  it('should not return disabled routes if env variable is defined', async () => {
    process.env.DISABLED_ROUTES = '/land/choose-land-boundary-upload;/land/geospatial-land-boundary'
    server = await startServer({ ...serverOptions, port: 3001 })
    const response = await server.inject({
      method: 'GET',
      url: '/land/choose-land-boundary-upload'
    })
    expect(response.statusCode).toEqual(404)
  })
})
