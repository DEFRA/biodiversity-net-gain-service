import constants from '../../utils/constants.js'
import { getPayment } from '../../payment/payment-session.js'
import bacs from '../../payment/bacs.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.DEVELOPER_APP_REFERENCE)
    const payment = getPayment(request.yar)
    request.yar.reset()
    request.yar.set(constants.redisKeys.DEVELOPER_APPLICATION_SUBMITTED, true)
    return h.view(constants.views.APPLICATION_SUBMITTED, {
      applicationReference,
      payment,
      bacs
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRMATION,
  handler: handlers.get
}]
