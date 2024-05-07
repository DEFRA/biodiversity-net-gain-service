import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const ADD_DEVELOPMENT_PROJECT_INFORMATION = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEVELOPMENT_PROJECT_INFORMATION,
  [
    creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_PLANNING_AUTHORITY_LIST
  ]
)

const addDevelopmentProjectInformationJourneys = [
  [
    journeyStepFromRoute(ADD_DEVELOPMENT_PROJECT_INFORMATION)
  ]
]

export {
  addDevelopmentProjectInformationJourneys
}
