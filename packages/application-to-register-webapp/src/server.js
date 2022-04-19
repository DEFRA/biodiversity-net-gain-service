import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'
import session from './plugins/session.js'
import cache from './plugins/cache.js'
import Blipp from 'blipp'
import { SERVER_PORT } from './utils/config.js'

const createServer = async options => {
  // Create the hapi server
  options = Object.assign({
    port: SERVER_PORT,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      cors: true,
      security: true
    },
    cache: cache
  }, options)

  return new Hapi.Server(options)
}

const init = async server => {
  // Register the plugins
  await server.register(Inert)
  await server.register(views)
  await server.register(router)
  await server.register(errorPages)
  await server.register(logging)
  await server.register(session)
  await server.register(Blipp)

  // Start the server
  await server.start()
}

export { createServer, init }
