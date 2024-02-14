import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(creditsPurchaseConstants.views.CREDITS_CHECK_YOUR_ANSWERS)
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_CHECK_YOUR_ANSWERS,
  handler: handlers.get
}]
