import { paymentDetails } from '../../payment/gov-pay-api/payment-details.js'
import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.LAND_PAYMENT_SUCCESS,
    options: {
      handler: async (request, h) => {
        return h.view(constants.views.LAND_PAYMENT_SUCCESS)
      }
    }
  }
]
