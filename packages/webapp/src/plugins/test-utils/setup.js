import Hapi from '@hapi/hapi'
import Yar from '@hapi/yar'
import redirectView from '../redirect-view.js'

export const getServer = async () => {
  const server = Hapi.server()

  await server.register([
    {
      plugin: Yar,
      options: {
        storeBlank: false,
        cookieOptions: {
          password: 'q9w7r5u3i1e0w9o7p5a3s1d9f7g5h3j1k9l7z5x3c1v9b7n5m3q1w0e8r6t4y2u0i8o6p4a2s0d8f6g4h2j0k8l6z4x2c0v8b6n4m2',
          isSecure: false
        }
      }
    },
    redirectView
  ])

  return server
}
