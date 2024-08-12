import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_CLIENT_INDIVIDUAL_ORGANISATION)
  },
  post: async (request, h) => {
    return getNextStep(request, h, (e) => {
      return h.view(constants.views.CHANGE_CLIENT_INDIVIDUAL_ORGANISATION, {
        err: [e]
      })
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHANGE_CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHANGE_CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
