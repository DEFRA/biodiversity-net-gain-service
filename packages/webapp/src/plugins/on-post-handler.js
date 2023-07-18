import constants from '../utils/constants.js'

const onPostHandler = {
  plugin: {
    name: 'on-post-handler',
    register: (server, _options) => {
      server.ext('onPostHandler', function (request, h) {
        // filter out everything but view gets
        if (request.response.variety === 'view') {
          if (request.method === 'get') {
            // if getting a view then set headers to stop client caching
            request.response.headers['cache-control'] = 'no-cache, no-store, must-revalidate'
            if (request.headers.referer) {
              // If referer was a check route then set the session referer
              // Route then decides whether to redirect to referer or not
              const setReferer = constants.setReferer.find(item => request.headers.referer.indexOf(item) > -1)
              const clearReferer = constants.clearReferer.find(item => request.headers.referer.indexOf(item) > -1)
              if (setReferer) {
                request.yar.set(constants.redisKeys.REFERER, `/${setReferer}`)
              } else if (clearReferer) {
                request.yar.clear(constants.redisKeys.REFERER)
              }
            } else {
              // If no referer then clear referer key because user has broken the journey
              request.yar.clear(constants.redisKeys.REFERER)
            }
          }

          // Add Account details to context if present
          if (request.auth?.isAuthenticated && request.auth.credentials?.account) {
            if (!h.request.response.source.context) {
              h.request.response.source.context = {}
            }
            const accountInfo = request.auth.credentials.account.idTokenClaims
            h.request.response.source.context.auth = {
              isAuthenticated: true,
              firstName: accountInfo.firstName,
              lastName: accountInfo.lastName,
              email: accountInfo.email,
              contactId: accountInfo.contactId
            }
          }
        }
        return h.continue
      })
    }
  }
}

export default onPostHandler
