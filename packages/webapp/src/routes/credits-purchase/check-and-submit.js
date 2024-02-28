import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const getApplicationDetails = () => ({
  dummy: 'Hello'
})

const handlers = {
  get: (request, h) => {
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS, getApplicationDetails())
  },
  post: (request, h) => h.redirect('#')
}

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS,
    handler: handlers.post
  }
]
