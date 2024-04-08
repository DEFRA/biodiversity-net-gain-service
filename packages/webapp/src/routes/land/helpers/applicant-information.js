import path from 'path'
import constants from '../../../utils/constants.js'

const getClientName = (session, isIndividual) => {
  if (isIndividual) {
    const name = session.get(constants.cacheKeys.CLIENTS_NAME_KEY)?.value
    return `${name?.firstName} ${name?.lastName}`
  }

  return session.get(constants.cacheKeys.CLIENTS_ORGANISATION_NAME_KEY)
}

const addOptionalAddressLine = (line) => line?.trim() ? `${line}<br>` : ''

const getAddress = (session, addressIsUK) => {
  if (addressIsUK) {
    const ukAddress = session.get(constants.cacheKeys.UK_ADDRESS_KEY)
    return `${ukAddress?.addressLine1}<br>` +
      addOptionalAddressLine(ukAddress?.addressLine2) +
      `${ukAddress?.town}<br>` +
      addOptionalAddressLine(ukAddress?.county) +
      `${ukAddress?.postcode}`
  }

  const internationalAddress = session.get(constants.cacheKeys.NON_UK_ADDRESS_KEY)
  return `${internationalAddress?.addressLine1}<br>` +
    addOptionalAddressLine(internationalAddress?.addressLine2) +
    addOptionalAddressLine(internationalAddress?.addressLine3) +
    `${internationalAddress?.town}<br>` +
    addOptionalAddressLine(internationalAddress?.postcode) +
    `${internationalAddress?.country}`
}

const applicationInformationContext = session => {
  const context = {}

  context.actingForClient = session.get(constants.cacheKeys.IS_AGENT) === 'yes'
  context.accountDetailsUpToDate = session.get(constants.cacheKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED) === 'true'
  context.addressIsUK = session.get(constants.cacheKeys.IS_ADDRESS_UK_KEY) === 'yes'

  if (context.actingForClient) {
    context.clientIsIndividual = session.get(constants.cacheKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY) === constants.individualOrOrganisationTypes.INDIVIDUAL
    context.clientName = getClientName(session, context.clientIsIndividual)
    context.clientAddress = getAddress(session, context.addressIsUK)
    context.authorisationFile = path.basename(session.get(constants.cacheKeys.WRITTEN_AUTHORISATION_LOCATION) ?? '')

    if (context.clientIsIndividual) {
      context.clientEmail = session.get(constants.cacheKeys.CLIENTS_EMAIL_ADDRESS_KEY)
      context.clientPhone = session.get(constants.cacheKeys.CLIENTS_PHONE_NUMBER_KEY)
    }
  } else {
    context.applicantIsIndividual = session.get(constants.cacheKeys.LANDOWNER_TYPE) === constants.individualOrOrganisationTypes.INDIVIDUAL
    context.applicantAddress = getAddress(session, context.addressIsUK)
  }

  return context
}

export default applicationInformationContext
