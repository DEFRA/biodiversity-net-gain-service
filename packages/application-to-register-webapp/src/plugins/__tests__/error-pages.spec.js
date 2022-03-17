import plugin from '../error-pages.js'
import { createServer, init } from '../../server.js'
import serverOptions from '../../__tests__/server-options.js'

describe('error-pages', () => {
  it('is a plugin', () => {
    expect(plugin.name).toEqual('error-pages')
    expect(typeof plugin.register).toEqual('function')
  })

  it('handles 404 for server', async () => {
    const server = await createServer(serverOptions)
    await init(server)
    const response = await server.inject({
      method: 'GET',
      url: '/sdgfdfghdfghdf'
    })
    expect(response.statusCode).toEqual(404)
    await server.stop()
  })

  it('it handles internal error', async () => {
    const server = await createServer(serverOptions)
    await init(server)
    const response = await server.inject({
      method: 'GET',
      url: '/error'
    })
    expect(response.statusCode).toEqual(500)
    await server.stop()
  })
})
