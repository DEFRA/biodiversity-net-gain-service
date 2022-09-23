import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'
import session from './plugins/session.js'
import cache from './plugins/cache.js'
import Blipp from 'blipp'
import {
  DATABASE_HOST, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, INITIALISE_DATABASE,
  KEEP_ALIVE_TIMEOUT_MS, SERVER_PORT
} from './utils/config.js'
import createDatabaseConfiguration from './db-access/schema-init.js'

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
    cache
  }, options)

  return new Hapi.Server(options)
}

const init = async server => {
  // Register the plugins
  await server.register(Inert)
  await server.register(views)
  await server.register(await router())
  await server.register(errorPages)
  await server.register(logging)
  await server.register(session)
  await server.register(Blipp)

  // Override the default keep alive timeout if required.
  // This is important for file uploads in containerised development environments.
  server.listener.keepAliveTimeout = parseInt(KEEP_ALIVE_TIMEOUT_MS) || server.listener.keepAliveTimeout
  if (INITIALISE_DATABASE) {
    const connected = await createDatabaseConfiguration(DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD)
    if (connected) {
      console.info('Database initialisation successful')
      await startServer(server)
    } else {
      console.log(`Database initialisation failed ${connected} unable to start server`)
    }
  } else {
    // Start the server
    await startServer(server)
  }
}

const startServer = async (server) => {
  // Start the server
  await server.start()
}

export { createServer, init }
