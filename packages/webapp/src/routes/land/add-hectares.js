import constants from '../../utils/constants.js'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land boundary details'
    }, {
      inProgressUrl: constants.routes.ADD_HECTARES
    })
    const hectares = request.yar.get(constants.redisKeys.LAND_BOUNDARY_HECTARES)
    return h.view(constants.views.ADD_HECTARES, {
      hectares
    })
  },
  post: async (request, h) => {
    const hectares = request.payload.hectares
    const err = validateHectares(hectares)
    if (err) {
      return h.view(constants.views.ADD_HECTARES, {
        hectares,
        err: [{
          text: err,
          href: '#hectares'
        }]
      })
    } else {
      request.yar.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, parseFloat(parseFloat(request.payload.hectares).toFixed(2)))
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LAND_BOUNDARY_DETAILS)
    }
  }
}

const validateHectares = hectares => {
  if (hectares.length === 0) {
    return 'Enter the size of the land in hectares'
  }
  if (parseFloat(parseFloat(hectares).toFixed(2)) < 0.01) {
    return 'Size of the land must be more than 0.00 hectares'
  }
  if (isNaN(hectares)) {
    return 'Size of land must be a number, like 19 or 19.00'
  }
  return ''
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_HECTARES,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.ADD_HECTARES,
  handler: handlers.post
}]
