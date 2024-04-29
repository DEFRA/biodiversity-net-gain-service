import constants from '../../utils/constants.js'
import { SERVICE_HOME_URL } from '../../utils/config.js'
import createPayment from '../../payment/gov-pay-api/payment-create.js'

const handlers = {
  get: async (request, h) => {
    const payload = {
      amount: 123,
      reference: 'TEST',
      description: 'test description',
      email: 'test@test.com',
      return_url: `${SERVICE_HOME_URL}/land/payment-return`,
      language: 'en'
    }
    const res = await createPayment(payload)
    request.yar.set(constants.redisKeys.LAND_PAYMENT_REFERENCE, res.payment_id)
    return h.redirect(res._links.next_url.href, 301)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LAND_PAYMENT,
  handler: handlers.get
}]
