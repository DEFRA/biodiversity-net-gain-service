import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const handlers = {
  get: async (request, h) => {
    const confirmed = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED) === 'true'
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TERMS_AND_CONDITIONS, { confirmed })
  },
  post: async (request, h) => {
    const consent = request.payload.termsAndConditions
    if (!consent) {
      return h.redirectView(creditsPurchaseConstants.views.CREDITS_PURCHASE_TERMS_AND_CONDITIONS, {
        err: [{
          text: 'Check the box to confirm you have read the terms and conditions',
          href: '#termsAndConditions'
        }]
      })
    } else {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED, consent)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    }
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  handler: addRedirectViewUsed(handlers.post)
}]
