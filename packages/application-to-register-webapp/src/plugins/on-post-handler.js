import constants from '../utils/constants.js'

const onPostHandler = {
  plugin: {
    name: 'on-post-handler',
    register: (server, _options) => {
      server.ext('onPostHandler', function (request, h) {
        // If referer was a check route then set the session referer
        // Route then decides whether to redirect to referer or not
        if (request.method === 'get' && request.response.variety === 'view') {
          if (request.headers.referer) {
            const checkReferer = constants.checkRoutes.find(item => request.headers.referer.indexOf(item) > -1)
            if (checkReferer) {
              request.yar.set(constants.redisKeys.REFERER, `/${checkReferer}`)
            }
          } else {
            // If no referer then clear referer key because user has broken the journey
            request.yar.clear(constants.redisKeys.REFERER)
          }
        }

        return h.continue
      })
    }
  }
}

export default onPostHandler
