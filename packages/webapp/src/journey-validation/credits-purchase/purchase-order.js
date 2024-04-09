import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const PURCHASE_ORDER = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER,
  [
    creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_PURCHASE_ORDER_USED
    // Ignore purchase order number for now
  ]
)

const purchaseOrderJourneys = [
  [
    journeyStepFromRoute(PURCHASE_ORDER)
  ]
]

export {
  purchaseOrderJourneys
}
