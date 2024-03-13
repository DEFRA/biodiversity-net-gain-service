import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const ADD_CREDITS = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION]
)

const addCreditsJourneys = [
  [
    journeyStepFromRoute(ADD_CREDITS)
  ]
]

export {
  addCreditsJourneys
}
