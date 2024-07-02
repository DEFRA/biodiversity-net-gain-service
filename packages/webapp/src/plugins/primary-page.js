import constants from '../utils/constants.js'

const primaryPage = {
  name: 'primary-page',
  register: (server, _options) => {
    const routeMapping = constants.primaryPages || {}

    server.ext('onPostHandler', (request, h) => {
      const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE)
      const targetRoutes = routeMapping[applicationType] || []

      if (targetRoutes.includes(request.path)) {
        request.yar.set(constants.redisKeys.PRIMARY_ROUTE, request.path)
      }
      return h.continue
    })
  }
}

export default primaryPage
