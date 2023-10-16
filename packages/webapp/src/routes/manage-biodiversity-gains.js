import constants from '../utils/constants.js'

let enableDev = false
if (process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y') {
  enableDev = true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.MANAGE_BIODIVERSITY_GAINS, {
    enableDev
  })
}

export default [{
  method: 'GET',
  path: constants.routes.MANAGE_BIODIVERSITY_GAINS,
  handler: handlers.get
}]
