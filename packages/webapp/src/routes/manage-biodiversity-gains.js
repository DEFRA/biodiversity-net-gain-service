import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => h.view(constants.views.MANAGE_BIODIVERSITY_GAINS, {
    enableDev: process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y'
  })
}

export default [{
  method: 'GET',
  path: constants.routes.MANAGE_BIODIVERSITY_GAINS,
  handler: handlers.get
}]
