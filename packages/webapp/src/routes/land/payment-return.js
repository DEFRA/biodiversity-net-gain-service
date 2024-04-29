import { paymentDetails } from '../../payment/gov-pay-api/payment-details.js'
import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.LAND_PAYMENT_RETURN,
    options: {
      handler: async (request, h) => {
        const paymentId = request.yar.get(constants.redisKeys.LAND_PAYMENT_REFERENCE)
        const payment = await paymentDetails(paymentId)

        const status = payment.state.status

        if (status === constants.paymentStatus.FAILED ||
          status === constants.paymentStatus.CANCELLED ||
          status === constants.paymentStatus.ERROR) {
          return h.redirect(constants.routes.LAND_PAYMENT_FAILURE)
        }

        return h.redirect(constants.routes.LAND_PAYMENT_SUCCESS)
      }
    }
  }
]
