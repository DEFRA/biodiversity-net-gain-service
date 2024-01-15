import constants from '../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from './helpers.js'

const AGENT_ACTING_FOR_CLIENT = routeDefinition(
  constants.routes.AGENT_ACTING_FOR_CLIENT,
  [constants.redisKeys.IS_AGENT]
)

const CHECK_DEFRA_ACCOUNT_DETAILS = routeDefinition(
  constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  [constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED]
)

const CLIENT_INDIVIDUAL_ORGANISATION = routeDefinition(
  constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  [constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY]
)

const APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION = routeDefinition(
  constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  [constants.redisKeys.LANDOWNER_TYPE]
)

const IS_ADDRESS_UK = routeDefinition(
  constants.routes.IS_ADDRESS_UK,
  [constants.redisKeys.IS_ADDRESS_UK_KEY]
)

const UK_ADDRESS = routeDefinition(
  constants.routes.UK_ADDRESS,
  [constants.redisKeys.UK_ADDRESS_KEY]
)

const NON_UK_ADDRESS = routeDefinition(
  constants.routes.NON_UK_ADDRESS,
  [constants.redisKeys.NON_UK_ADDRESS_KEY]
)

const CLIENTS_ORGANISATION_NAME = routeDefinition(
  constants.routes.CLIENTS_ORGANISATION_NAME,
  [constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY]
)

const UPLOAD_WRITTEN_AUTHORISATION = routeDefinition(
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  [
    constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION,
    constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE,
    constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE
  ]
)

const CHECK_WRITTEN_AUTHORISATION_FILE = routeDefinition(
  constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  [constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED]
)

const CLIENTS_NAME = routeDefinition(
  constants.routes.CLIENTS_NAME,
  [constants.redisKeys.CLIENTS_NAME_KEY]
)

const CLIENTS_EMAIL_ADDRESS = routeDefinition(
  constants.routes.CLIENTS_EMAIL_ADDRESS,
  [constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY]
)

const CLIENTS_PHONE_NUMBER = routeDefinition(
  constants.routes.CLIENTS_PHONE_NUMBER,
  [constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY]
)

const AGENT_NO = journeyStepFromRoute(AGENT_ACTING_FOR_CLIENT, ['no'], true)
const AGENT_YES = journeyStepFromRoute(AGENT_ACTING_FOR_CLIENT, ['yes'], true)
const CHECK_ACCOUNT = journeyStepFromRoute(CHECK_DEFRA_ACCOUNT_DETAILS, ['true'])
const CLIENT_IS_INDIVIDUAL = journeyStepFromRoute(CLIENT_INDIVIDUAL_ORGANISATION, ['individual'], true)
const CLIENT_IS_ORGANISATION = journeyStepFromRoute(CLIENT_INDIVIDUAL_ORGANISATION, ['organisation'], true)
const APPLICANT_IS_INDIVIDUAL = journeyStepFromRoute(APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, ['individual'], true)
const APPLICANT_IS_ORGANISATION = journeyStepFromRoute(APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, ['organisation'], true)
const CLIENT_ORG_NAME = journeyStepFromRoute(CLIENTS_ORGANISATION_NAME)
const CLIENT_INDIV_NAME = journeyStepFromRoute(CLIENTS_NAME)
const CLIENT_EMAIL = journeyStepFromRoute(CLIENTS_EMAIL_ADDRESS)
const CLIENT_PHONE = journeyStepFromRoute(CLIENTS_PHONE_NUMBER)

const HAS_UK_ADDRESS = [
  journeyStepFromRoute(IS_ADDRESS_UK, ['yes'], true),
  journeyStepFromRoute(UK_ADDRESS)
]

const HAS_INTERNATIONAL_ADDRESS = [
  journeyStepFromRoute(IS_ADDRESS_UK, ['no'], true),
  journeyStepFromRoute(NON_UK_ADDRESS)
]

const WRITTEN_AUTH = journeyStep(
  UPLOAD_WRITTEN_AUTHORISATION.startUrl,
  [
    ...UPLOAD_WRITTEN_AUTHORISATION.sessionKeys,
    ...CHECK_WRITTEN_AUTHORISATION_FILE.sessionKeys
  ],
  [ANY, ANY, ANY, 'yes']
)

const individualJourneyBase = [
  AGENT_NO,
  APPLICANT_IS_INDIVIDUAL,
  CHECK_ACCOUNT
]

const organisationJourneyBase = [
  AGENT_NO,
  APPLICANT_IS_ORGANISATION,
  CHECK_ACCOUNT
]

const individualUKJourney = [
  ...individualJourneyBase,
  ...HAS_UK_ADDRESS
]

const individualInternationalJourney = [
  ...individualJourneyBase,
  ...HAS_INTERNATIONAL_ADDRESS
]

const organisationUKJourney = [
  ...organisationJourneyBase,
  ...HAS_UK_ADDRESS
]

const organisationInternationalJourney = [
  ...organisationJourneyBase,
  ...HAS_INTERNATIONAL_ADDRESS
]

const agentIndividualJourneyBase = [
  AGENT_YES,
  CHECK_ACCOUNT,
  CLIENT_IS_INDIVIDUAL,
  CLIENT_INDIV_NAME
]

const agentOrganisationJourneyBase = [
  AGENT_YES,
  CHECK_ACCOUNT,
  CLIENT_IS_ORGANISATION,
  CLIENT_ORG_NAME
]

const agentIndividualJourneyEnd = [
  CLIENT_EMAIL,
  CLIENT_PHONE,
  WRITTEN_AUTH
]

const agentIndividualUKJourney = [
  ...agentIndividualJourneyBase,
  ...HAS_UK_ADDRESS,
  ...agentIndividualJourneyEnd
]

const agentIndividualInternationalJourney = [
  ...agentIndividualJourneyBase,
  ...HAS_INTERNATIONAL_ADDRESS,
  ...agentIndividualJourneyEnd
]

const agentOrganisationUKJourney = [
  ...agentOrganisationJourneyBase,
  ...HAS_UK_ADDRESS,
  WRITTEN_AUTH
]

const agentOrganisationInternationalJourney = [
  ...agentOrganisationJourneyBase,
  ...HAS_INTERNATIONAL_ADDRESS,
  WRITTEN_AUTH
]

const applicantInfoJourneys = [
  individualUKJourney,
  individualInternationalJourney,
  organisationUKJourney,
  organisationInternationalJourney,
  agentIndividualUKJourney,
  agentIndividualInternationalJourney,
  agentOrganisationUKJourney,
  agentOrganisationInternationalJourney
]

export {
  applicantInfoJourneys
}
