import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_TYPE_LEGAL_AGREEMENT)
  },
  post: async (request, h) => {
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHANGE_TYPE_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHANGE_TYPE_LEGAL_AGREEMENT,
  handler: handlers.post
}]
