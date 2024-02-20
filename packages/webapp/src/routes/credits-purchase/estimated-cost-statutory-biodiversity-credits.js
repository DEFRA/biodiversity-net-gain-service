import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_COST)
  },
  post: async (request, h) => {
    return h.redirect('/')
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST,
  handler: handlers.post
}]
