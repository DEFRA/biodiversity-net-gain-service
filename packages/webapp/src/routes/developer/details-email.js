import constants from '../../utils/constants.js'
import { validateEmail } from '../../utils/helpers.js'

const ID = '#emailAddress'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    const emailAddress = request.payload.emailAddress
    const error = validateEmail(emailAddress, ID)
    if (error) {
      return h.view(constants.views.DEVELOPER_DETAILS_EMAIL, {
        emailAddress,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, emailAddress)
      // Note: Temp location added and will be cover into next ticket
      return h.redirect('#')
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_DETAILS_EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_DETAILS_EMAIL,
  handler: handlers.post
}]
