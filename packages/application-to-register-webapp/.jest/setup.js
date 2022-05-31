import { createServer, init } from '../src/server.js'
import serverOptions from '../src/__mocks__/server-options.js'

let server

beforeEach(async () => {
  if (!process.env.USE_MOCK_SERVER) {
    server = await createServer(serverOptions)
    await init(server)
  }
})

afterEach(async () => {
  if (server) {
    await server.stop()
  }
})

const getServer = () => {
  return server
}

export { getServer }
