import constants from '../utils/constants.js'

const redirectView = {
  name: 'redirect-view',
  register: (server, _options) => {
    server.decorate('toolkit', 'redirectView', function (route, data) {
      if (this.request.isInjected && route !== '/test') {
        return this.view(route, data)
      }

      this.request.yar.set(constants.redisKeys.VIEW_DATA, { data, route })
      return this.response().redirect(this.request._route.path).takeover()
    })

    server.ext('onPreResponse', (request, h) => {
      const method = request?.route?.method ?? undefined
      if (request.redirectViewUsed && method && method === 'get') {
        const viewData = request.yar.get(constants.redisKeys.VIEW_DATA)
        request.yar.clear(constants.redisKeys.VIEW_DATA)
        h.request.yar.clear(constants.redisKeys.VIEW_DATA)
        if (viewData) {
          const { data, route } = viewData
          return h.view(route, data)
        }
      }
      return h.continue
    })
    server.ext('onPostHandler', (request, h) => {
      if (request.method === 'post' && request.redirectViewUsed) {
        request.yar.clear(constants.redisKeys.VIEW_DATA)
      }
      return h.continue
    })
  }
}

export default redirectView
