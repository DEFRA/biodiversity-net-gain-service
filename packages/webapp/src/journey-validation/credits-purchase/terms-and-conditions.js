import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const TERMS_AND_CONDITIONS = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS,
  [creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED]
)

const termsAndConditionsJourneys = [
  [
    journeyStepFromRoute(TERMS_AND_CONDITIONS, ['true'])
  ]
]

export {
  termsAndConditionsJourneys
}
