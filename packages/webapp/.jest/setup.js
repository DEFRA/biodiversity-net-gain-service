import { createServer, init } from '../src/server.js'
import serverOptions from '../src/__mocks__/server-options.js'
// Mock out msal authentication client
jest.mock('@azure/msal-node', () => {
  return {
    ConfidentialClientApplication: jest.fn().mockImplementation(() => {
      return {
        getAuthCodeUrl: () => {
          return 'signin-url'
        },
        acquireTokenSilent: () => {
          return ''
        },
        acquireTokenByCode: () => {
          return {
            token: 'test'
          }
        },
        getTokenCache: () => {
          return {
            removeAccount: () => {}
          }
        }
      }
    }),
    LogLevel: {
      Error: 'Error',
      Info: 'Info'
    }
  }
})

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
