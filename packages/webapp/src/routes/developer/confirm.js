import constants from '../../utils/constants.js'
import { getPayment } from '../../payment/payment-session.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.DEVELOPER_APP_REFERENCE)
    const payment = getPayment(request.yar, 'payment')
    // Reset user session as submitted
    request.yar.reset()
    return h.view(constants.views.DEVELOPER_APPLICATION_SUBMITTED, {
      applicationReference,
      payment
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_APPLICATION_SUBMITTED,
  handler: handlers.get
}]
