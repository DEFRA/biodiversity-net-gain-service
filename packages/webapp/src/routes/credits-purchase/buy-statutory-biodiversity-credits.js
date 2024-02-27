import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST,
    handler: (request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TASK_LIST)
  }
]
