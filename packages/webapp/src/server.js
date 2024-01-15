import Hapi from '@hapi/hapi'
import crypto from 'crypto'
import Inert from '@hapi/inert'
import auth from './plugins/auth.js'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'
import session from './plugins/session.js'
import cache from './plugins/cache.js'
import onPreHandler from './plugins/on-pre-handler.js'
import onPostHandler from './plugins/on-post-handler.js'
import Blipp from 'blipp'
import { KEEP_ALIVE_TIMEOUT_MS, SERVER_PORT } from './utils/config.js'

const createServer = async options => {
  // Create the hapi server
  options = {
    ...{
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
    },
    ...options
  }

  return new Hapi.Server(options)
}

const init = async server => {
  // Register the plugins
  await server.register(auth)
  await server.register(Inert)
  await server.register(views)
  await server.register(await router())
  await server.register(errorPages)
  await server.register(logging)
  await server.register(session)
  await server.register(Blipp)
  await server.register(onPreHandler)
  await server.register(onPostHandler)
  server.ext('onPreResponse', (request, h) => {
    // sha refer https://github.com/alphagov/govuk-frontend/issues/1657
    const scriptHash = '+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='
    const nonce = crypto.randomBytes(16).toString('base64')
    if (!request.response.source.context) {
      request.response.source.context = {}
    }
    request.response.source.context.nonce = nonce
    const response = request.response
    if (response.header) {
      const csp = 'default-src \'self\'; ' +
                    `script-src 'self' 'nonce-${nonce}' 'sha256-${scriptHash}'; ` +
                    `style-src 'self' 'nonce-${nonce}'; ` +
                    'img-src \'self\';'

      response.header('Content-Security-Policy', csp)
    }
    return h.continue
  })
  // Override the default keep alive timeout if required.
  // This is important for file uploads in containerised development environments.
  server.listener.keepAliveTimeout = parseInt(KEEP_ALIVE_TIMEOUT_MS) || server.listener.keepAliveTimeout

  // Start the server
  await server.start()
}

export { createServer, init }
