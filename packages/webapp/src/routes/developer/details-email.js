import constants from '../../utils/constants.js'
import { emailValidator } from '../../utils/helpers.js'

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
    const error = emailValidator(emailAddress, ID)
    if (error) {
      request.yar.clear(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
      return h.view(constants.views.DEVELOPER_DETAILS_EMAIL, {
        emailAddress,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, emailAddress)
      return h.redirect(constants.routes.DEVELOPER_DETAILS_EMAIL_CONFIRM)
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
