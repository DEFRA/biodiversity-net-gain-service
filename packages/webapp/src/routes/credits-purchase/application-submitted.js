import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE)
    request.yar.reset()
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_SUBMITTED, true)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRMATION, { applicationReference })
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRMATION,
  handler: handlers.get
}]
