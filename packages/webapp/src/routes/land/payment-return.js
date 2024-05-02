import { paymentDetails } from '../../payment/gov-pay-api/payment-details.js'
import constants from '../../utils/constants.js'
import { postJson } from '../../utils/http.js'
import applicationValidation from '../../utils/application-validation.js'
import application from '../../utils/application.js'

export default [
  {
    method: 'GET',
    path: constants.routes.LAND_PAYMENT_RETURN,
    options: {
      handler: async (request, h) => {
        const { value, error } = applicationValidation.validate(application(request.yar, request.auth.credentials.account))
        if (error) {
          throw new Error(error)
        }

        const paymentId = request.yar.get(constants.redisKeys.LAND_PAYMENT_REFERENCE)
        const payment = await paymentDetails(paymentId)

        const status = payment.state.status
        const amount = (payment.amount / 100).toFixed(2)

        await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processpayment`, {
          ...value,
          ...{
            payment_reference: paymentId,
            payment_status: status,
            payment_amount: amount
          }
        })

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
