import constants from '../../utils/constants.js'
import { validateEmail } from '../../utils/helpers.js'

const ID = '#emailAddress'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.LAND_OWNER_EMAIL)
    return h.view(constants.views.LAND_OWNER_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    const emailAddress = request.payload.emailAddress
    const error = validateEmail(emailAddress, ID)
    if (error) {
      return h.view(constants.views.LAND_OWNER_EMAIL, {
        emailAddress,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.LAND_OWNER_EMAIL, emailAddress)
      return h.redirect(constants.routes.CORRECT_OWNER_EMAIL)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LAND_OWNER_EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_OWNER_EMAIL,
  handler: handlers.post
}]
