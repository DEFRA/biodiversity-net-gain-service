import constants from '../../utils/constants.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'
import { routeDefinition } from '../utils.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const createAgentActingForClientRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.IS_AGENT],
  (session) => {
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isApplicantAgent === 'yes') {
      return referrerUrl || nextUrl
    } else if (isApplicantAgent === 'no') {
      return referrerUrl || altNextUrl
    } else {
      const message = 'Select yes if you are an agent acting on behalf of a client'
      throw new FormError(message, {
        text: message,
        href: '#isApplicantAgent'
      })
    }
  }
)

const createCheckDefraAccountDetailsRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (referrerUrl) {
      return referrerUrl
    } else if (session.get(constants.redisKeys.IS_AGENT) === constants.APPLICANT_IS_AGENT.YES) {
      return nextUrl
    } else {
      return altNextUrl
    }
  }
)

const clientIndividualOrganisationRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY],
  (session) => {
    const individualOrOrganisation = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return session.get(referrerUrl, true) || nextUrl
    } else {
      return session.get(referrerUrl, true) || altNextUrl
    }
  }
)

const appByIndividualOrOrgRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
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
        return referrerUrl || nextUrl
      }

      if (isIndividual) {
        throw new FormError(organisationSignInErrorMessage, {
          text: organisationSignInErrorMessage,
          href: '#individualOrOrganisation'
        })
      } else if (isOrganisation) {
        if (noOrganisationsLinkedToDefraAccount) {
          return altNextUrl
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

const isAddressUkRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.IS_ADDRESS_UK_KEY],
  (session) => {
    const isAddressUk = session.get(constants.redisKeys.IS_ADDRESS_UK_KEY)
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    if (isAddressUk === 'yes') {
      return nextUrl
    } else if (isAddressUk === 'no') {
      return altNextUrl
    } else {
      const message = `Select yes if your ${isApplicantAgent === 'yes' ? 'client\'s ' : ''}address is in the UK`
      throw new FormError(message, {
        text: message,
        href: '#is-address-uk-yes'
      })
    }
  }
)

const ukAddressRoute = (startUrl, nextUrl, altNextUrl, alt1NextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.UK_ADDRESS_KEY],
  (session) => {
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    const isIndividualOrOrganisation = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    if (isApplicantAgent === 'no') {
      return nextUrl
    }
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return referrerUrl || altNextUrl
    } else {
      return referrerUrl || alt1NextUrl
    }
  }
)

const noUkAddressRoute = (startUrl, nextUrl, altNextUrl, alt1NextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.NON_UK_ADDRESS_KEY],
  (session) => {
    const isApplicantAgent = session.get(constants.redisKeys.IS_AGENT)
    const isIndividualOrOrganisation = session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    if (isApplicantAgent === 'no') {
      return nextUrl
    }
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return referrerUrl || altNextUrl
    } else {
      return referrerUrl || alt1NextUrl
    }
  }
)

const clientsOrgNameRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || nextUrl
  }
)

const uploadWrittenAuthRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [
    constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION,
    constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE,
    constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE
  ],
  () => {
    return nextUrl
  }
)

const checkWrittenAuthFileRoute = (startUrl, nextUrl, altNextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED],
  (session) => {
    const checkWrittenAuthorisation = session.get(constants.redisKeys.WRITTEN_AUTHORISATION_CHECKED)
    if (checkWrittenAuthorisation === 'no') {
      return nextUrl
    } else if (checkWrittenAuthorisation === 'yes') {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
      return referrerUrl || altNextUrl
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
)

const clientsNameRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.CLIENTS_NAME_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || nextUrl
  }
)

const clientsEmailAddressRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || nextUrl
  }
)

const clientsPhoneNumberRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    return referrerUrl || nextUrl
  }
)

const checkAppInfoRoute = (startUrl, nextUrl) => routeDefinition(
  startUrl,
  [],
  () => {
    return nextUrl
  }
)

const changeClientIndividualOrganisationRoute = (startUrl, nextUrl, nextUrl1) => routeDefinition(
  startUrl,
  [],
  (session, request) => {

    const { changeClientIndividualOrganisation } = request.payload

    if (changeClientIndividualOrganisation === 'yes') {
      request.yar.clear(constants.redisKeys.LANDOWNER_TYPE)
      request.yar.clear(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
      request.yar.clear(constants.redisKeys.IS_ADDRESS_UK_KEY)
      request.yar.clear(constants.redisKeys.UK_ADDRESS_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_NAME_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY)
      request.yar.clear(constants.redisKeys.REFERER)

      return nextUrl
    } else if (changeClientIndividualOrganisation === 'no') {
      return nextUrl1
    } else {
      const message = 'Select yes if you want to change whether your client is an individual or organisation'
      throw new FormError(message, {
        text: message,
        href: '#changeClientIndividualOrganisation'
      })
    }
  }
)

const changeActingOnBehalfOfClientRoute = (startUrl, nextUrl, nextUrl1) => routeDefinition(
  startUrl,
  [],
  (session, request) => {

    const { changeActingOnBehalfOfClient } = request.payload

    if (changeActingOnBehalfOfClient === 'yes') {
      request.yar.clear(constants.redisKeys.IS_AGENT)
      request.yar.clear(constants.redisKeys.LANDOWNER_TYPE)
      request.yar.clear(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
      request.yar.clear(constants.redisKeys.IS_ADDRESS_UK_KEY)
      request.yar.clear(constants.redisKeys.UK_ADDRESS_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_NAME_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY)
      request.yar.clear(constants.redisKeys.REFERER)

      return nextUrl
    } else if (changeActingOnBehalfOfClient === 'no') {
      return nextUrl1
    } else {
      const message = 'Select yes if you want to change whether you’re acting on behalf of a client'
      throw new FormError(message, {
        text: message,
        href: '#changeActingOnBehalfOfClient'
      })
    }
  }
)

export {
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
  checkAppInfoRoute,
  changeClientIndividualOrganisationRoute,
  changeActingOnBehalfOfClientRoute
}
