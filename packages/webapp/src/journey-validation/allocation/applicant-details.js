import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStepFromRoute,
  journeyStep
} from '../utils.js'

const AGENT_ACTING_FOR_CLIENT = routeDefinition(
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  [constants.redisKeys.DEVELOPER_IS_AGENT]
)

const CHECK_DEFRA_ACCOUNT_DETAILS = routeDefinition(
  constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
  [constants.redisKeys.DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED]
)

const IS_LANDOWNER = routeDefinition(
  constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
  [constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER]
)

const INDIVIDUAL_ORGANISATION = routeDefinition(
  constants.routes.DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  [constants.redisKeys.DEVELOPER_LANDOWNER_TYPE]
)

const CLIENT_INDIVIDUAL_ORGANISATION = routeDefinition(
  constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION,
  [constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION]
)

const CLIENT_INDIVIDUAL_NAME = routeDefinition(
  constants.routes.DEVELOPER_CLIENTS_NAME,
  [constants.redisKeys.DEVELOPER_CLIENTS_NAME]
)

const CLIENT_ORGANISATION_NAME = routeDefinition(
  constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME,
  [constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME]
)

const WRITTEN_AUTHORISATION_UPLOAD = routeDefinition(
  constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
  [
    constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION,
    constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE,
    constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE
  ]
)

const WRITTEN_AUTHORISATION_CHECKED = routeDefinition(
  constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
  [constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_CHECKED]
)

const LANDOWNER_CONSENT_UPLOAD = routeDefinition(
  constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
  [
    constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION,
    constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE,
    constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE,
    constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME
  ]
)

const LANDOWNER_CONSENT_CHECK = routeDefinition(
  constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
  [constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_CHECKED]
)

const PROOF_OF_PERMISSION = routeDefinition(
  constants.routes.DEVELOPER_NEED_PROOF_OF_PERMISSION,
  [constants.redisKeys.DEVELOPER_PROOF_OF_PERMISSION_SEEN]
)

const AGENT_YES = journeyStepFromRoute(AGENT_ACTING_FOR_CLIENT, ['yes'], true)
const AGENT_NO = journeyStepFromRoute(AGENT_ACTING_FOR_CLIENT, ['no'], true)
const CHECK_ACCOUNT = journeyStepFromRoute(CHECK_DEFRA_ACCOUNT_DETAILS, ['true'])
const LANDOWNER_YES = journeyStepFromRoute(IS_LANDOWNER, ['yes'], true)
const LANDOWNER_NO = journeyStepFromRoute(IS_LANDOWNER, ['no'], true)
const PROOF_REQUIRED_SEEN = journeyStepFromRoute(PROOF_OF_PERMISSION, [true])
const IS_INDIVIDUAL = journeyStepFromRoute(INDIVIDUAL_ORGANISATION, [constants.individualOrOrganisationTypes.INDIVIDUAL], true)
const IS_ORGANISATION = journeyStepFromRoute(INDIVIDUAL_ORGANISATION, [constants.individualOrOrganisationTypes.ORGANISATION], true)

const WRITTEN_AUTHORISATION = journeyStep(
  WRITTEN_AUTHORISATION_UPLOAD.startUrl,
  [
    ...WRITTEN_AUTHORISATION_UPLOAD.sessionKeys,
    ...WRITTEN_AUTHORISATION_CHECKED.sessionKeys
  ],
  [ANY, ANY, ANY, 'yes']
)

const LANDOWNER_CONSENT = journeyStep(
  LANDOWNER_CONSENT_UPLOAD.startUrl,
  [
    ...LANDOWNER_CONSENT_UPLOAD.sessionKeys,
    ...LANDOWNER_CONSENT_CHECK.sessionKeys
  ],
  [ANY, ANY, ANY, ANY, 'yes']
)

const clientIndividual = [
  journeyStepFromRoute(CLIENT_INDIVIDUAL_ORGANISATION, [constants.individualOrOrganisationTypes.INDIVIDUAL], true),
  journeyStepFromRoute(CLIENT_INDIVIDUAL_NAME)
]

const clientOrganisation = [
  journeyStepFromRoute(CLIENT_INDIVIDUAL_ORGANISATION, [constants.individualOrOrganisationTypes.ORGANISATION], true),
  journeyStepFromRoute(CLIENT_ORGANISATION_NAME)
]

const agentBase = [
  AGENT_YES,
  CHECK_ACCOUNT
]

const agentLandownerBase = [
  ...agentBase,
  LANDOWNER_YES
]

const agentNotLandownerBase = [
  ...agentBase,
  LANDOWNER_NO
]

const agentLandownerIndividualJourney = [
  ...agentLandownerBase,
  ...clientIndividual,
  WRITTEN_AUTHORISATION
]

const agentLandownerOrganisationJourney = [
  ...agentLandownerBase,
  ...clientOrganisation,
  WRITTEN_AUTHORISATION
]

const agentNotLandownerIndividualJourney = [
  ...agentNotLandownerBase,
  ...clientIndividual,
  PROOF_REQUIRED_SEEN,
  WRITTEN_AUTHORISATION,
  LANDOWNER_CONSENT
]

const agentNotLandownerOrganisationJourney = [
  ...agentNotLandownerBase,
  ...clientOrganisation,
  PROOF_REQUIRED_SEEN,
  WRITTEN_AUTHORISATION,
  LANDOWNER_CONSENT
]

const notAgentLandownerIndividualJourney = [
  AGENT_NO,
  LANDOWNER_YES,
  IS_INDIVIDUAL,
  CHECK_ACCOUNT
]

const notAgentLandownerOrganisationJourney = [
  AGENT_NO,
  LANDOWNER_YES,
  IS_ORGANISATION,
  CHECK_ACCOUNT
]

const notAgentNotLandownerIndividualJourney = [
  AGENT_NO,
  LANDOWNER_NO,
  IS_INDIVIDUAL,
  CHECK_ACCOUNT,
  LANDOWNER_CONSENT
]

const notAgentNotLandownerOrganisationJourney = [
  AGENT_NO,
  LANDOWNER_NO,
  IS_ORGANISATION,
  CHECK_ACCOUNT,
  LANDOWNER_CONSENT
]

const applicantDetailsJourneys = [
  agentLandownerIndividualJourney,
  agentLandownerOrganisationJourney,
  agentNotLandownerIndividualJourney,
  agentNotLandownerOrganisationJourney,
  notAgentLandownerIndividualJourney,
  notAgentLandownerOrganisationJourney,
  notAgentNotLandownerIndividualJourney,
  notAgentNotLandownerOrganisationJourney
]

console.log(applicantDetailsJourneys)

export {
  applicantDetailsJourneys
}
