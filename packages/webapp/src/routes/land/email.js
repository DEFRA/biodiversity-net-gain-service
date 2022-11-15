import constants from '../../utils/constants.js'
import { validateEmail } from '../../utils/helpers.js'

const ID = '#emailAddress'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.EMAIL_VALUE)
    return h.view(constants.views.EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    const emailAddress = request.payload.emailAddress
    const error = validateEmail(emailAddress, ID)
    if (error) {
      return h.view(constants.views.EMAIL, {
        emailAddress,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.EMAIL_VALUE, emailAddress)
      return h.redirect(constants.routes.CORRECT_EMAIL)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.EMAIL,
  handler: handlers.post
}]
