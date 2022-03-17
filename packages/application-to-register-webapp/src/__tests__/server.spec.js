import { createServer, init } from '../server.js'
import serverOptions from './server-options.js'

describe('The server', () => {
  it('starts', async () => {
    const server = await createServer(serverOptions)
    await init(server)
    expect(server.info.port).toEqual(3000)
    await server.stop()
  })

  it('handles a request', async () => {
    const server = await createServer(serverOptions)
    await init(server)
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toContain('Hello or World?')
    await server.stop()
  })

  it('handles a request', async () => {
    const server = await createServer(serverOptions)
    await init(server)
    const response = await server.inject({
      method: 'POST',
      url: '/',
      payload: {
        helloWorld: 'hello'
      }
    })
    expect(response.statusCode).toEqual(302)
    await server.stop()
  })
})
