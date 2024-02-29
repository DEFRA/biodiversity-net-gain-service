import { checked, validateLengthOfCharsLessThan50 } from '../../utils/helpers.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_ORDER,
    handler: (request, h) => {
      const willPOInUse = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_WILL_PO_IN_USE)
      const purchaseOrderNumber = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER)

      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_ORDER, {
        willPOInUse,
        purchaseOrderNumber,
        checked
      })
    }
  },
  {
    method: 'POST',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_ORDER,
    handler: async (request, h) => {
      const willPOInUse = request.payload.willPOInUse
      const purchaseOrderNumber = request.payload.purchaseOrderNumber
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_WILL_PO_IN_USE, willPOInUse)

      const error = validateData(willPOInUse, purchaseOrderNumber)
      if (error) {
        return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_ORDER, {
          purchaseOrderNumber,
          willPOInUse,
          checked,
          ...error
        })
      } else if (willPOInUse === 'yes') {
        request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER, purchaseOrderNumber)
      } else {
        request.yar.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER)
      }

      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASKLIST, {
        purchaseOrderNumber: null,
        willPOInUse,
        checked
      })
    }
  }
]

const validateData = (willPOInUse, purchaseOrderNumber) => {
  let error = {}
  if (!willPOInUse) {
    error.err = [{
      text: 'Select yes if you will be using a purchase order',
      href: '#willPOInUseYes'
    }]
  } else if (willPOInUse === 'yes' && !purchaseOrderNumber?.trim()) {
    error.err = [{
      text: 'Purchase order number cannot be left blank',
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
