import constants from '../utils/constants.js'
import { getPayment } from '../payment/payment-session.js'
import bacs from '../payment/bacs.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.APPLICATION_REFERENCE)
    const payment = getPayment(request.yar)

    // Reset user session as submitted
    request.yar.reset()
    return h.view(constants.views.APPLICATION_SUBMITTED, {
      applicationReference,
      payment,
      bacs
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICATION_SUBMITTED,
  handler: handlers.get
}]
