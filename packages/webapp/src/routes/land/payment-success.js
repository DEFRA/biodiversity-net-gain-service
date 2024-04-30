import { paymentDetails } from '../../payment/gov-pay-api/payment-details.js'
import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.LAND_PAYMENT_SUCCESS,
    options: {
      handler: async (request, h) => {
        const reference = request.yar.get(constants.redisKeys.LAND_PAYMENT_REFERENCE)
        const payment = await paymentDetails(reference)
        const amount = (payment.amount/100).toFixed(2)
        const description = payment.description

        return h.view(constants.views.LAND_PAYMENT_SUCCESS, { reference, amount, description })
      }
    }
  }
]
