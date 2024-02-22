import creditsPurchaseConstants from "../../utils/credits-purchase-constants.js"

const getApplicationReference = request => {
  let reference = null
  reference = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE)
  return reference
}

const handlers = {
  get: async (request, h) => {
    const applicationReference = getApplicationReference(request)
    return applicationReference !== null
      ? h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRMATION, { applicationReference })
      : h.view(creditsPurchaseConstants.views.MANAGE_BIODIVERSITY_GAINS)
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRMATION,
  handler: handlers.get
}]
