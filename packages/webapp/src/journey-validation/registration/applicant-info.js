import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'
import { FormError } from '../../utils/form-error.js'

const AGENT_ACTING_FOR_CLIENT = routeDefinition(
  constants.routes.AGENT_ACTING_FOR_CLIENT,
  [constants.redisKeys.IS_AGENT],
  (session) => {
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isApplicantAgent === 'yes') {
      return referrerUrl || constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS
    } else if (isApplicantAgent === 'no') {
      return referrerUrl || constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION
    } else {
      const message = 'Select yes if you are an agent acting on behalf of a client'
      throw new FormError(message, {
        text: message,
        href: '#isApplicantAgent'
      })
    }
  }
)

const CHECK_DEFRA_ACCOUNT_DETAILS = routeDefinition(
  constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  [constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (referrerUrl) {
      return referrerUrl
    } else if (session.get(constants.redisKeys.IS_AGENT) === constants.APPLICANT_IS_AGENT.YES) {
      return constants.routes.CLIENT_INDIVIDUAL_ORGANISATION
    } else {
      return constants.routes.IS_ADDRESS_UK
    }
  }
)

const CLIENT_INDIVIDUAL_ORGANISATION = routeDefinition(
  constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  [constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY],
  (session) => {
    const individualOrOrganisation = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return session.get(referrerUrl, true) || constants.routes.CLIENTS_NAME
    } else {
      return session.get(referrerUrl, true) || constants.routes.CLIENTS_ORGANISATION_NAME
    }
  }
)

const APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION = routeDefinition(
  constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  [constants.redisKeys.LANDOWNER_TYPE],
  (session, request) => {
    const individualSignInErrorMessage = `
  You cannot apply as an organisation because the Defra account you’re signed into is linked to an individual.
  Register for or sign into a Defra account representing an organisation before continuing this application`

    const organisationSignInErrorMessage = `
  You cannot apply as an individual because the Defra account you’re signed into is linked to an organisation.
  Register for or sign into a Defra account as yourself before continuing this application`
    const individualOrOrganisation = session.get(constants.redisKeys.LANDOWNER_TYPE)
    if (individualOrOrganisation) {
      request.yar.set(constants.redisKeys.LANDOWNER_TYPE, individualOrOrganisation)

      const { noOrganisationsLinkedToDefraAccount, currentOrganisation: organisation } =
        getOrganisationDetails(request.auth.credentials.account.idTokenClaims)

      const isIndividual = individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL
      const isOrganisation = individualOrOrganisation === constants.individualOrOrganisationTypes.ORGANISATION

      if ((isIndividual && !organisation) || (isOrganisation && organisation)) {
        const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
        return referrerUrl || constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS
      }

      if (isIndividual) {
        throw new FormError(organisationSignInErrorMessage, {
          text: organisationSignInErrorMessage,
          href: '#individualOrOrganisation'
        })
      } else if (isOrganisation) {
        if (noOrganisationsLinkedToDefraAccount) {
          return constants.routes.DEFRA_ACCOUNT_NOT_LINKED
        } else {
          throw new FormError(individualSignInErrorMessage, {
            text: individualSignInErrorMessage,
            href: '#individualOrOrganisation'
          })
        }
      }
    } else {
      const message = 'Select if you are applying as an individual or as part of an organisation'
      throw new FormError(message, {
        text: message,
        href: '#individualOrOrganisation'
      })
    }
  }
)

const IS_ADDRESS_UK = routeDefinition(
  constants.routes.IS_ADDRESS_UK,
  [constants.redisKeys.IS_ADDRESS_UK_KEY],
  (session) => {
    const isAddressUk = session.get(constants.redisKeys.IS_ADDRESS_UK_KEY)
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    if (isAddressUk === 'yes') {
      return constants.routes.UK_ADDRESS
    } else if (isAddressUk === 'no') {
      return constants.routes.NON_UK_ADDRESS
    } else {
      const message = `Select yes if your ${isApplicantAgent === 'yes' ? 'client\'s ' : ''}address is in the UK`
      throw new FormError(message, {
        text: message,
        href: '#is-address-uk-yes'
      })
    }
  }
)

const UK_ADDRESS = routeDefinition(
  constants.routes.UK_ADDRESS,
  [constants.redisKeys.UK_ADDRESS_KEY],
  (session) => {
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    const isIndividualOrOrganisation = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    if (isApplicantAgent === 'no') {
      return constants.routes.CHECK_APPLICANT_INFORMATION
    }
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return referrerUrl || constants.routes.CLIENTS_EMAIL_ADDRESS
    } else {
      return referrerUrl || constants.routes.UPLOAD_WRITTEN_AUTHORISATION
    }
  }
)

const NON_UK_ADDRESS = routeDefinition(
  constants.routes.NON_UK_ADDRESS,
  [constants.redisKeys.NON_UK_ADDRESS_KEY],
  (session) => {
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    const isIndividualOrOrganisation = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    if (isApplicantAgent === 'no') {
      return constants.routes.CHECK_APPLICANT_INFORMATION
    }
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return referrerUrl || constants.routes.CLIENTS_EMAIL_ADDRESS
    } else {
      return referrerUrl || constants.routes.UPLOAD_WRITTEN_AUTHORISATION
    }
  }
)

const CLIENTS_ORGANISATION_NAME = routeDefinition(
  constants.routes.CLIENTS_ORGANISATION_NAME,
  [constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || constants.routes.IS_ADDRESS_UK
  }
)

const UPLOAD_WRITTEN_AUTHORISATION = routeDefinition(
  constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  [
    constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION,
    constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE,
    constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE
  ],
  () => {
    return constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE
  }
)

const CHECK_WRITTEN_AUTHORISATION_FILE = routeDefinition(
  constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE,
  [constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED],
  (session) => {
    const checkWrittenAuthorisation = session.get(constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED)
    if (checkWrittenAuthorisation === 'no') {
      return constants.routes.UPLOAD_WRITTEN_AUTHORISATION
    } else if (checkWrittenAuthorisation === 'yes') {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
      return referrerUrl || constants.routes.CHECK_APPLICANT_INFORMATION
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
)

const CLIENTS_NAME = routeDefinition(
  constants.routes.CLIENTS_NAME,
  [constants.redisKeys.CLIENTS_NAME_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || constants.routes.IS_ADDRESS_UK
  }
)

const CLIENTS_EMAIL_ADDRESS = routeDefinition(
  constants.routes.CLIENTS_EMAIL_ADDRESS,
  [constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || constants.routes.CLIENTS_PHONE_NUMBER
  }
)

const CLIENTS_PHONE_NUMBER = routeDefinition(
  constants.routes.CLIENTS_PHONE_NUMBER,
  [constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || constants.routes.UPLOAD_WRITTEN_AUTHORISATION
  }
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
  CLIENTS_PHONE_NUMBER
]

export {
  applicantInfoJourneys,
  applicantInfoRouteDefinitions
}
