import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'
import Blipp from 'blipp'

const createServer = async () => {
  // Create the hapi server
  return new Hapi.Server({
    port: process.env.PORT || 3000,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })
}

const init = async server => {
  // Register the plugins
  await server.register(Inert)
  await server.register(views)
  await server.register(router)
  await server.register(errorPages)
  await server.register(logging)
  await server.register(Blipp)

  // Start the server
  await server.start()
}

export { createServer, init }
