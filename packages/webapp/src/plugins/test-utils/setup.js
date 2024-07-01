import Hapi from '@hapi/hapi'
import Yar from '@hapi/yar'
import redirectView from '../redirect-view.js'
import { SESSION_COOKIE_PASSWORD } from '../../utils/config.js'

export const getServer = async () => {
  const server = Hapi.server()

  await server.register([
    {
      plugin: Yar,
      options: {
        storeBlank: false,
        cookieOptions: {
          password: SESSION_COOKIE_PASSWORD,
          isSecure: false
        }
      }
    },
    redirectView
  ])

  return server
}
