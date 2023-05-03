import { createServer, init } from '../src/server.js'
import serverOptions from '../src/__mocks__/server-options.js'

const ORIGINAL_ENV = process.env
let server, context

beforeEach(async () => {
  jest.resetAllMocks()
  if (!process.env.USE_MOCK_SERVER) {
    server = await createServer(serverOptions)
    await init(server)
  }
})

afterEach(async () => {
  try {
    if (server) {
      await server.stop()
    }
  } finally {
     process.env = { ...ORIGINAL_ENV }
  }
})

const getServer = () => server

const getContext = () => context

export { getServer, getContext}
