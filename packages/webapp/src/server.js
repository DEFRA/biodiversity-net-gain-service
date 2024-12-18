import Hapi from '@hapi/hapi'
import appInsights from 'applicationinsights'
import crypto from 'crypto'
import Inert from '@hapi/inert'
import auth from './plugins/auth.js'
import views from './plugins/views.js'
import router from './plugins/router.js'
import errorPages from './plugins/error-pages.js'
import logging from './plugins/logging.js'
import session from './plugins/session.js'
import cache from './plugins/cache.js'
import header from './plugins/header.js'
import answerIdHandler from './plugins/answer-id-handler.js'
import onPreHandler from './plugins/on-pre-handler.js'
import onPostHandler from './plugins/on-post-handler.js'
import primaryPage from './plugins/primary-page.js'
import Blipp from 'blipp'
import { KEEP_ALIVE_TIMEOUT_MS, SERVER_PORT, SERVICE_HOME_URL } from './utils/config.js'

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
        }
      },
      cache
    },
    ...options
  }

  return new Hapi.Server(options)
}

const init = async server => {
  // Register app insights
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup().start()
  }

  // Register the plugins
  await server.register(auth)
  await server.register(Inert)
  await server.register(views)
  await server.register(await router())
  await server.register(errorPages)
  await server.register(logging)
  await server.register(session)
  await server.register(Blipp)
  await server.register(answerIdHandler)
  await server.register(onPreHandler)
  await server.register(onPostHandler)
  await server.register(primaryPage)
  await server.register({
    plugin: header,
    options: {
      keys: [
        { key: 'X-Frame-Options', value: 'deny' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Access-Control-Allow-Origin', value: SERVICE_HOME_URL },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=15768000;' },
        { key: 'Cache-Control', value: 'no-cache' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'interest-cohort=()' }
      ]
    }
  })
  server.ext('onPreResponse', (request, h) => {
    const response = request.response
    // Check if the response is a view and source is an object
    if (response.variety === 'view' && response.source && typeof response.source === 'object') {
      const nonce = crypto.randomBytes(16).toString('base64')
      // Ensure the context object exists for the view
      if (!response.source.context) {
        response.source.context = {}
      }
      // Set the nonce in the context
      response.source.context.nonce = nonce
      // Set CSP header if response allows setting headers
      const scriptHash = 'GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='
      // This is a hash of the inline script in GDS template. It is added to the CSP to except the in-line
      const csp = 'default-src \'self\'; ' +
            `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' 'sha256-${scriptHash}' www.googletagmanager.com; ` +
            `style-src 'self' 'nonce-${nonce}'; ` +
            'img-src \'self\'; ' +
            'font-src \'self\' fonts.gstatic.com data:; ' +
            'connect-src \'self\' *.google-analytics.com; ' +
            'frame-ancestors \'none\''
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
