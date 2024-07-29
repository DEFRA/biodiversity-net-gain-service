import constants from '../../utils/constants.js'
import { validateEmail } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const handlers = {
  get: async (request, h) => {
    const email = request.yar.get(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY)
    return h.view(constants.views.CLIENTS_EMAIL_ADDRESS, {
      email
    })
  },
  post: async (request, h) => {
    const email = request.payload.email
    const error = validateEmail(email, '#email')
    if (error) {
      if (error.err[0].text === 'Enter your email address') {
        error.err[0].text = 'Enter email address'
      }
      return h.view(constants.views.CLIENTS_EMAIL_ADDRESS, {
        err: error.err,
        email
      })
    }
    request.yar.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY, email)
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_EMAIL_ADDRESS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENTS_EMAIL_ADDRESS,
  handler: handlers.post
}]
