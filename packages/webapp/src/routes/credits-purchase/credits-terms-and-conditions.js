import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TERMS_AND_CONDITIONS)
  },
  post: async (request, h) => {
    const consent = request.payload.termsAndConditions
    if (!consent) {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TERMS_AND_CONDITIONS, {
        err: [{
          text: 'Check the box to confirm you have read the Ts and Cs',
          href: '#termsAndConditions'
        }]
      })
    } else {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED, consent)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS)
    }
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  handler: handlers.post
}]
