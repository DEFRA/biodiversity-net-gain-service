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
        const amount = (payment.amount / 100).toFixed(2)
        const description = payment.description

        return h.view(constants.views.LAND_PAYMENT_FAILURE, { message: payment.state.message, amount, description })
      }
    }
  },
  {
    method: 'POST',
    path: constants.routes.LAND_PAYMENT_FAILURE,
    options: {
      handler: async (request, h) => {
        return h.redirect(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
      }
    }
  }
]
