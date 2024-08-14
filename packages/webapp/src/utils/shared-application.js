import constants from './constants.js'
import path from 'path'

export const getApplicant = (account, session, isAgentKey = constants.redisKeys.IS_AGENT, orgRole = constants.applicantTypes.REPRESENTATIVE, defaultRole = constants.applicantTypes.LANDOWNER) => ({
  id: account.idTokenClaims.contactId,
  role: getApplicantRole(session, isAgentKey, orgRole, defaultRole)
})

export const getApplicantRole = (session, isAgentKey, orgRole, defaultRole) => {
  const applicantIsAgent = session.get(isAgentKey)
  const organisationId = session.get(constants.redisKeys.ORGANISATION_ID)

  let applicantRole

  if (applicantIsAgent === constants.APPLICANT_IS_AGENT.YES) {
    applicantRole = constants.applicantTypes.AGENT
  } else if (organisationId) {
    applicantRole = orgRole
  } else {
    applicantRole = defaultRole
  }

  return applicantRole
}

export const getFile = (session, fileType, filesize, fileLocation, optional) => ({
  contentMediaType: session.get(fileType),
  fileType: fileType.replace('-file-type', ''),
  fileSize: session.get(filesize),
  fileLocation: session.get(fileLocation),
  fileName: session.get(fileLocation) && path.basename(session.get(fileLocation)),
  optional
})

export const getGainSite = session => {
  const gainSiteReference = session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const habitat = metricData.habitatOffSiteGainSiteSummary?.find(item => item['Gain site reference'] === gainSiteReference)
  const hedge = metricData.hedgeOffSiteGainSiteSummary?.find(item => item['Gain site reference'] === gainSiteReference)
  const waterCourse = metricData.waterCourseOffSiteGainSiteSummary?.find(item => item['Gain site reference'] === gainSiteReference)

  return {
    reference: gainSiteReference,
    offsiteUnitChange: {
      habitat: habitat ? parseFloat(habitat['Habitat Offsite unit change per gain site (Post SRM)']) : 0,
      hedge: hedge ? parseFloat(hedge['Hedge Offsite unit change per gain site (Post SRM)']) : 0,
      watercourse: waterCourse ? parseFloat(waterCourse['Watercourse Offsite unit change per gain site (Post SRM)']) : 0
    }
  }
}

const getIndividualClientDetails = session => {
  const { firstName, lastName } =
    session.get(constants.redisKeys.CLIENTS_NAME_KEY).value

  const clientEmail =
    session.get(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY)

  const clientPhoneNumber =
    session.get(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY)

  return {
    clientNameIndividual: {
      firstName,
      lastName
    },
    clientEmail,
    clientPhoneNumber
  }
}

const getOrganisationClientDetails = session => {
  const clientNameOrganisation =
    session.get(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY)

  return {
    clientNameOrganisation
  }
}

export const getAddress = session => {
  const isUkAddress =
    session.get(constants.redisKeys.IS_ADDRESS_UK_KEY) === constants.ADDRESS_IS_UK.YES

  const addressType =
    isUkAddress ? constants.ADDRESS_TYPES.UK : constants.ADDRESS_TYPES.INTERNATIONAL

  const cachedAddress =
    isUkAddress
      ? session.get(constants.redisKeys.UK_ADDRESS_KEY)
      : session.get(constants.redisKeys.NON_UK_ADDRESS_KEY)

  const address = {
    type: addressType,
    line1: cachedAddress.addressLine1,
    town: cachedAddress.town
  }

  if (cachedAddress.addressLine2) {
    address.line2 = cachedAddress.addressLine2
  }

  if (cachedAddress.addressLine3) {
    address.line3 = cachedAddress.addressLine3
  }

  if (cachedAddress.postcode) {
    address.postcode = cachedAddress.postcode
  }

  if (isUkAddress && cachedAddress.county) {
    address.county = cachedAddress.county
  }

  if (!isUkAddress && cachedAddress.country) {
    address.country = cachedAddress.country
  }

  return address
}

export const getClientDetails = session => {
  const clientType =
    session.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
  const clientAddress = getAddress(session)

  const clientDetails = {
    clientType,
    clientAddress
  }

  if (clientType === constants.individualOrOrganisationTypes.INDIVIDUAL) {
    Object.assign(clientDetails, getIndividualClientDetails(session))
  } else {
    Object.assign(clientDetails, getOrganisationClientDetails(session))
  }

  return clientDetails
}