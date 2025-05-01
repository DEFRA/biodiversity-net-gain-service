import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: async (request, h) => {
    const confirmed = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED) === 'true'

    const errors = request.yar.get('errors') || null
    request.yar.clear('errors')

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TERMS_AND_CONDITIONS, {
      confirmed,
      err: errors
    })
  },
  post: async (request, h) => {
    const consent = request.payload.termsAndConditions
    if (!consent) {
      request.yar.set('errors', [{
        text: 'Check the box to confirm you have read the terms and conditions',
        href: '#termsAndConditions'
      }])
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS)
    }

    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED, consent)
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
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
