import constants from '../utils/constants.js'
import { formatAppRef } from '../utils/helpers.js'
import { getPayment } from '../payment/payment-session.js'
import bacs from '../payment/account-details.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = formatAppRef(request.yar.get(constants.redisKeys.APPLICATION_REFERENCE))
    const payment = getPayment(request.yar)

    // Reset user session as submitted
    request.yar.reset()
    return h.view(constants.views.REGISTRATION_SUBMITTED, {
      applicationReference,
      payment,
      bacs
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTRATION_SUBMITTED,
  handler: handlers.get
}]
