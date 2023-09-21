import constants from '../../credits/constants.js'
import { checked } from '../../utils/helpers.js'

export default [
  {
    method: 'GET',
    path: constants.routes.ESTIMATOR_CREDITS_PURCHASE_ORDER,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const willPOInUse = request.yar.get(constants.redisKeys.WILL_CREDITS_PO_IN_USE)
      const purchaseOrderNumber = request.yar.get(constants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER)

      return h.view(constants.views.ESTIMATOR_CREDITS_PURCHASE_ORDER, {
        willPOInUse,
        purchaseOrderNumber,
        checked
      })
    }
  },
  {
    method: 'POST',
    path: constants.routes.ESTIMATOR_CREDITS_PURCHASE_ORDER,
    options: {
      auth: false
    },
    handler: async (request, h) => {
      const willPOInUse = request.payload.willPOInUse
      const purchaseOrderNumber = request.payload.purchaseOrderNumber
      request.yar.set(constants.redisKeys.WILL_CREDITS_PO_IN_USE, willPOInUse)

      const error = validateData(willPOInUse, purchaseOrderNumber)
      if (error) {
        return h.view(constants.views.ESTIMATOR_CREDITS_PURCHASE_ORDER, {
          purchaseOrderNumber,
          willPOInUse,
          checked,
          ...error
        })
      } else if (willPOInUse === 'yes') {
        request.yar.set(constants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER, purchaseOrderNumber)

        return h.view(constants.views.ESTIMATOR_CREDITS_PURCHASE_ORDER, {
          purchaseOrderNumber,
          willPOInUse,
          checked
        })
      } else {
        request.yar.clear(constants.redisKeys.CREDITS_PURCHASE_ORDER_NUMBER)

        return h.view(constants.views.ESTIMATOR_CREDITS_PURCHASE_ORDER, {
          purchaseOrderNumber: null,
          willPOInUse,
          checked
        })
      }
    }
  }
]

const validateData = (willPOInUse, purchaseOrderNumber) => {
  const error = {}
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
  }
  return error.err ? error : null
}
