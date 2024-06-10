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
          password: 'only-for-test-server-cookie-secret',
          isSecure: false
        }
      }
    },
    redirectView
  ])

  return server
}
