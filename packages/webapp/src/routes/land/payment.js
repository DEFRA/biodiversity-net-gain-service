import constants from '../../utils/constants.js'
import { SERVICE_HOME_URL } from '../../utils/config.js'
import createPayment from '../../payment/gov-pay-api/payment-create.js'
import applicationValidation from '../../utils/application-validation.js'
import application from '../../utils/application.js'
import fees from '../../payment/fees.js'
import { postJson } from '../../utils/http.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const { canSubmit } = getTaskList(constants.applicationTypes.REGISTRATION, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }
    const { value, error } = applicationValidation.validate(application(request.yar, request.auth.credentials.account))
    if (error) {
      throw new Error(error)
    }
    const payload = {
      amount: ((fees.find(f => f.caseType === 'registration').fee) * 100),
      reference: value.landownerGainSiteRegistration.payment.reference,
      description: 'Register a Gain Site',
      return_url: `${SERVICE_HOME_URL}/land/payment-return`,
      language: 'en'
    }
    const res = await createPayment(payload)
    request.yar.set(constants.redisKeys.LAND_PAYMENT_REFERENCE, res.payment_id)
    try {
      await postJson(`${constants.AZURE_FUNCTION_APP_URL}/processpayment`, {
        ...value,
        ...{
          payment_reference: res.payment_id,
          payment_status: res.state.status,
          payment_amount: res.amount / 100
        }
      })
    } catch (e) {
      console.log(e)
    }

    return h.redirect(res._links.next_url.href, 301)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LAND_PAYMENT,
  handler: handlers.get
}]
