import constants from '../../utils/constants.js'
import { getValidReferrerUrl, validateEmail } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const email = request.yar.get(constants.cacheKeys.CLIENTS_EMAIL_ADDRESS_KEY)
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
    request.yar.set(constants.cacheKeys.CLIENTS_EMAIL_ADDRESS_KEY, email)
    const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return h.redirect(referrerUrl || constants.routes.CLIENTS_PHONE_NUMBER)
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
