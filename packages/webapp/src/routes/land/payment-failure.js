import { paymentDetails } from '../../payment/gov-pay-api/payment-details.js'
import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.LAND_PAYMENT_FAILURE,
    options: {
      handler: async (request, h) => {
        const paymentId = request.yar.get(constants.redisKeys.LAND_PAYMENT_REFERENCE)
        const payment = await paymentDetails(paymentId)

        return h.view(constants.views.LAND_PAYMENT_FAILURE, { message: payment.state.message })
      }
    }
  }
]
