import constants from '../utils/constants.js'
import { getPayment } from '../payment/payment-session.js'
import bacs from '../payment/bacs.js'
import url from 'url'

const getApplicationReference = request => {
  const session = request.yar
  let reference = null
  const path = request.headers.referer ? new url.URL(request.headers.referer).pathname : null

  if (path === constants.routes.CHECK_AND_SUBMIT) {
    reference = session.get(constants.redisKeys.APPLICATION_REFERENCE)
  }

  if (path === constants.routes.DEVELOPER_CHECK_ANSWERS) {
    reference = session.get(constants.redisKeys.DEVELOPER_APP_REFERENCE)
  }
  return reference
}

const handlers = {
  get: async (request, h) => {
    const applicationReference = getApplicationReference(request) ? getApplicationReference(request) : null
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
