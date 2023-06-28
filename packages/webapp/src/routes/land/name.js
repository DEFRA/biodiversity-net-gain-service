import constants from '../../utils/constants.js'
import { processRegistrationTask, validateName } from '../../utils/helpers.js'

const ID = '#fullName'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Your details',
      title: 'Add your details'
    }, {
      inProgressUrl: constants.routes.NAME
    })
    const fullName = request.yar.get(constants.redisKeys.FULL_NAME) || request.auth.credentials.account.idTokenClaims.firstName + ' ' + request.auth.credentials.account.idTokenClaims.lastName
    return h.view(constants.views.NAME, {
      fullName
    })
  },
  post: async (request, h) => {
    const fullName = request.payload.fullName
    const error = validateName(fullName, ID)
    if (error) {
      return h.view(constants.views.NAME, {
        fullName,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.FULL_NAME, fullName)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.ROLE)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.NAME,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NAME,
  handler: handlers.post
}]
