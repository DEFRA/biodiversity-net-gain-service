import constants from '../../utils/constants.js'
import {
  ANY,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'

import {
  createAgentActingForClientRoute,
  createCheckDefraAccountDetailsRoute,
  clientIndividualOrganisationRoute,
  appByIndividualOrOrgRoute,
  isAddressUkRoute,
  ukAddressRoute,
  noUkAddressRoute,
  clientsOrgNameRoute,
  uploadWrittenAuthRoute,
  checkWrittenAuthFileRoute,
  clientsNameRoute,
  clientsEmailAddressRoute,
  clientsPhoneNumberRoute,
  checkAppInfoRoute
} from '../shared/applicant-info.js'

const AGENT_ACTING_FOR_CLIENT = createAgentActingForClientRoute(
  constants.routes.AGENT_ACTING_FOR_CLIENT,
  constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION
)

const CHECK_DEFRA_ACCOUNT_DETAILS = createCheckDefraAccountDetailsRoute(
  constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  constants.routes.IS_ADDRESS_UK
)

const CLIENT_INDIVIDUAL_ORGANISATION = clientIndividualOrganisationRoute(
  constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  constants.routes.CLIENTS_NAME,
  constants.routes.CLIENTS_ORGANISATION_NAME
)

const APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION = appByIndividualOrOrgRoute(
  constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  constants.routes.DEFRA_ACCOUNT_NOT_LINKED
)

const IS_ADDRESS_UK = isAddressUkRoute(
  constants.routes.IS_ADDRESS_UK,
  constants.routes.UK_ADDRESS,
  constants.routes.NON_UK_ADDRESS
)

const UK_ADDRESS = ukAddressRoute(
  constants.routes.UK_ADDRESS,
  constants.routes.CHECK_APPLICANT_INFORMATION,
  constants.routes.CLIENTS_EMAIL_ADDRESS,
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION
)
const NON_UK_ADDRESS = noUkAddressRoute(
  constants.routes.NON_UK_ADDRESS,
  constants.routes.CHECK_APPLICANT_INFORMATION,
  constants.routes.CLIENTS_EMAIL_ADDRESS,
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION
)

const CLIENTS_ORGANISATION_NAME = clientsOrgNameRoute(
  constants.routes.CLIENTS_ORGANISATION_NAME,
  constants.routes.IS_ADDRESS_UK
)

const UPLOAD_WRITTEN_AUTHORISATION = uploadWrittenAuthRoute(
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE
)

const CHECK_WRITTEN_AUTHORISATION_FILE = checkWrittenAuthFileRoute(
  constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  constants.routes.CHECK_APPLICANT_INFORMATION
)

const CLIENTS_NAME = clientsNameRoute(
  constants.routes.CLIENTS_NAME,
  constants.routes.IS_ADDRESS_UK
)

const CLIENTS_EMAIL_ADDRESS = clientsEmailAddressRoute(
  constants.routes.CLIENTS_EMAIL_ADDRESS,
  constants.routes.CLIENTS_PHONE_NUMBER
)

const CLIENTS_PHONE_NUMBER = clientsPhoneNumberRoute(
  constants.routes.CLIENTS_PHONE_NUMBER,
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION
)

const CHECK_APPLICANT_INFORMATION = checkAppInfoRoute(
  constants.routes.CHECK_APPLICANT_INFORMATION,
  constants.routes.COMBINED_CASE_TASK_LIST
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

const applicantInfoRouteDefinitions = [
  AGENT_ACTING_FOR_CLIENT,
  CHECK_DEFRA_ACCOUNT_DETAILS,
  CLIENT_INDIVIDUAL_ORGANISATION,
  APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  IS_ADDRESS_UK,
  UK_ADDRESS,
  NON_UK_ADDRESS,
  CLIENTS_ORGANISATION_NAME,
  UPLOAD_WRITTEN_AUTHORISATION,
  CHECK_WRITTEN_AUTHORISATION_FILE,
  CLIENTS_NAME,
  CLIENTS_EMAIL_ADDRESS,
  CLIENTS_PHONE_NUMBER,
  CHECK_APPLICANT_INFORMATION
]

export {
  applicantInfoJourneys,
  applicantInfoRouteDefinitions
}
