import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  dateClasses,
  processRegistrationTask
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Need landowners conservation covenant'
    }, {
      inProgressUrl: constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT
    })

    return h.view(constants.views.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT, {
      dateClasses
    })
  },
  post: async (request, h) => {
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
  handler: handlers.post
}]
