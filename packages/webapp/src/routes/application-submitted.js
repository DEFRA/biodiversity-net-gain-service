import constants from '../utils/constants.js'
import { formatAppRef } from '../utils/helpers.js'
import { getPayment } from '../payment/payment-session.js'
import bacs from '../payment/account-details.js'
import url from 'url'

const getApplicationReference = request => {
  const session = request.yar
  const path = new url.URL(request.headers.referer).pathname

  if (path === constants.routes.CHECK_AND_SUBMIT) {
    return session.get(constants.redisKeys.APPLICATION_REFERENCE)
  }

  if (path === constants.routes.DEVELOPER_CHECK_ANSWERS) {
    return session.get(constants.redisKeys.DEVELOPER_APP_REFERENCE)
  }
}

const handlers = {
  get: async (request, h) => {
    const applicationReference = formatAppRef(getApplicationReference(request))

    const payment = getPayment(request.yar)

    // Reset user session as submitted
    request.yar.reset()
    return h.view(constants.views.APPLICATION_SUBMITTED, {
      applicationReference,
      payment,
      bacs
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICATION_SUBMITTED,
  handler: handlers.get
}]
