import { validateLengthOfCharsLessThan50, getValidReferrerUrl } from '../../utils/helpers.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const validateData = (purchaseOrderUsed, purchaseOrderNumber) => {
  let error = {}
  if (!purchaseOrderUsed) {
    error.err = [{
      text: 'Select yes if you will be using a purchase order',
      href: '#purchaseOrderUsedYes'
    }]
  } else if (purchaseOrderUsed === 'yes' && !purchaseOrderNumber?.trim()) {
    error.err = [{
      text: 'Enter a purchase order number',
      href: '#purchaseOrderNumber'
    }, {
      text: '',
      href: ''
    }]
  } else {
    error = validateLengthOfCharsLessThan50(purchaseOrderNumber, 'purchase order number', '#purchaseOrderNumber')
  }
  return error?.err ? error : null
}

const handlers = {
  get: (request, h) => {
    const purchaseOrderUsed = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_USED)
    const purchaseOrderNumber = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_NUMBER)

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER, {
      purchaseOrderUsed,
      purchaseOrderNumber,
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST
    })
  },
  post: async (request, h) => {
    const purchaseOrderUsed = request.payload.purchaseOrderUsed
    const purchaseOrderNumber = request.payload.purchaseOrderNumber
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_USED, purchaseOrderUsed)

    const error = validateData(purchaseOrderUsed, purchaseOrderNumber)
    if (error) {
      return h.redirectView(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER, {
        purchaseOrderNumber,
        purchaseOrderUsed,
        ...error,
        backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST
      })
    } else if (purchaseOrderUsed === 'yes') {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_NUMBER, purchaseOrderNumber)
    } else {
      request.yar.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_NUMBER)
    }
    const referrerUrl = getValidReferrerUrl(request.yar, ['/credits-purchase/check-and-submit'])
    return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER,
  handler: addRedirectViewUsed(handlers.get)
},
{
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER,
  handler: addRedirectViewUsed(handlers.post)
}]
