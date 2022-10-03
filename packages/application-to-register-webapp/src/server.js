import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'
import session from './plugins/session.js'
import cache from './plugins/cache.js'
import Blipp from 'blipp'
import path from 'path'
import pg from 'pg'
import {
  DATABASE_HOST, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, INITIALISE_DATABASE,
  KEEP_ALIVE_TIMEOUT_MS, SERVER_PORT
} from './utils/config.js'
import createDatabaseConfiguration from '@defra/bng-database-lib'
const Client = pg.Client

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

  const created = createDatabase()
  if (created) {
    console.info('Database initialisation successful')
  } else {
    console.log('Database initialisation failed unable to start server')
  }
  // Start the server
  await server.start()
}

const createDatabase = () => {
  const client = new Client({
    user: DATABASE_USER,
    host: DATABASE_HOST,
    database: 'postgres',
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT
  })
  const workingDirectory = getWorkingDirectory()
  const configuration = {
    database: DATABASE_NAME,
    dbCreateFile: path.join(workingDirectory, '/src/dbscripts/bng_MVP_v_0.1_postgres.sql'),
    dbInsertFile: path.join(workingDirectory, './src/dbscripts/BNG_MVP_Postgres_Insert_V01.sql'),
    initialise: INITIALISE_DATABASE
  }
  return createDatabaseConfiguration(client, configuration)
}

const getWorkingDirectory = () => {
  let workingDirectory = process.cwd()
  if (workingDirectory.endsWith('gain-service')) {
    workingDirectory = path.join(workingDirectory, 'packages/application-to-register-webapp')
  } else {
    workingDirectory = path.join(workingDirectory, '/node_modules/@defra/bng-database-lib')
  }
  return workingDirectory
}

export { createServer, init }
