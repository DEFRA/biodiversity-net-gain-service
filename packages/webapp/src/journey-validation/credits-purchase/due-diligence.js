import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const INDIVIDUAL_OR_ORG = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE]
)

const CHECK_DEFRA_DETAILS = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED]
)

const MIDDLE_NAME = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME]
)

const DATE_OF_BIRTH = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH]
)

const NATIONALITY = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY]
)

const CHECK_CUSTOMER_DUE_DILIGENCE = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE]
)

const CHECK_ACCOUNT = journeyStepFromRoute(CHECK_DEFRA_DETAILS, ['true'])

const organisationJourney = [
  journeyStepFromRoute(INDIVIDUAL_OR_ORG, [creditsPurchaseConstants.applicantTypes.ORGANISATION], true),
  CHECK_ACCOUNT
]

const individualJourney = [
  journeyStepFromRoute(INDIVIDUAL_OR_ORG, [creditsPurchaseConstants.applicantTypes.INDIVIDUAL], true),
  CHECK_ACCOUNT,
  journeyStepFromRoute(MIDDLE_NAME),
  journeyStepFromRoute(DATE_OF_BIRTH),
  journeyStepFromRoute(NATIONALITY),
  journeyStepFromRoute(CHECK_CUSTOMER_DUE_DILIGENCE)
]

const dueDiligenceJourneys = [
  organisationJourney,
  individualJourney
]

export {
  dueDiligenceJourneys
}
