import constants from './constants.js'
import paymentConstants from '../payment/constants.js'
import path from 'path'
import savePayment from '../payment/save-payment.js'
import { getLpaNamesAndCodes } from './get-lpas.js'
import getHabitatType from './getHabitatType.js'

// Application object schema must match the expected payload format for the Operator application
const getApplicant = (account, session) => ({
  id: account.idTokenClaims.contactId,
  role: getApplicantRole(session)
})

const getApplicantRole = session => {
  const applicantIsAgent = session.get(constants.redisKeys.IS_AGENT)
  const organisationId = session.get(constants.redisKeys.ORGANISATION_ID)
  let applicantRole

  if (applicantIsAgent === constants.APPLICANT_IS_AGENT.YES) {
    applicantRole = constants.applicantTypes.AGENT
  } else if (organisationId) {
    applicantRole = constants.applicantTypes.REPRESENTATIVE
  } else {
    applicantRole = constants.applicantTypes.LANDOWNER
  }

  return applicantRole
}

const getClientDetails = session => {
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

const getOrganisation = session => ({
  id: session.get(constants.redisKeys.ORGANISATION_ID),
  address: getAddress(session)
})

const getAddress = session => {
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

const getHabitats = metricData => {
  const baselineIdentifiers = ['d1', 'e1', 'f1']
  const proposedIdentifiers = ['d2', 'e2', 'f2', 'd3', 'e3', 'f3']

  const getState = identifier => {
    switch (identifier.charAt(0)) {
      case 'd':
        return 'Habitat'
      case 'e':
        return 'Hedge'
      case 'f':
        return 'Watercourse'
    }
  }

  const getModule = identifier => {
    switch (identifier.charAt(identifier.length - 1)) {
      case '1':
        return 'Baseline'
      case '2':
        return 'Created'
      case '3':
        return 'Enhanced'
    }
  }

  const baseline = baselineIdentifiers.flatMap(identifier =>
    metricData[identifier].filter(details => 'Ref' in details).map(details => ({
      habitatType: getHabitatType(identifier, details),
      baselineReference: String(details.Ref),
      module: getModule(identifier),
      state: getState(identifier),
      condition: details.Condition,
      area: {
        beforeEnhancement: details['Length (km)'] ?? details['Area (hectares)'],
        afterEnhancement: details['Length enhanced'] ?? details['Area enhanced']
      },
      measurementUnits: 'Length (km)' in details ? 'kilometres' : 'hectares'
    }))
  )

  const proposed = proposedIdentifiers.flatMap(identifier =>
    metricData[identifier].filter(details => 'Condition' in details).map(details => ({
      habitatId: details['Habitat reference Number'] ? String(details['Habitat reference Number']) : details['Habitat reference Number'],
      habitatType: getHabitatType(identifier, details),
      baselineReference: details['Baseline ref'] ? String(details['Baseline ref']) : '',
      module: getModule(identifier),
      state: getState(identifier),
      condition: details.Condition,
      strategicSignificance: details['Strategic significance'],
      advanceCreation: details['Habitat created in advance (years)'] ?? details['Habitat enhanced in advance (years)'],
      delayedCreation: details['Delay in starting habitat creation (years)'] ?? details['Delay in starting habitat enhancement (years)'],
      area: details['Length (km)'] ?? details['Area (hectares)'],
      measurementUnits: 'Length (km)' in details ? 'kilometres' : 'hectares',
      ...(details['Extent of encroachment'] ? { encroachmentExtent: details['Extent of encroachment'] } : {}),
      ...(details['Extent of encroachment for both banks'] ? { encroachmentExtentBothBanks: details['Extent of encroachment for both banks'] } : {})
    }))
  )

  return { baseline, proposed }
}

const getFile = (session, fileType, filesize, fileLocation, optional) => ({
  contentMediaType: session.get(fileType),
  fileType: fileType.replace('-file-type', ''),
  fileSize: session.get(filesize),
  fileLocation: session.get(fileLocation),
  fileName: session.get(fileLocation) && path.basename(session.get(fileLocation)),
  optional
})

const getFiles = session => {
  const habitatPlanOptional = session.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO) === 'Yes'
  const writtenAuthorisationOptional = session.get(constants.redisKeys.IS_AGENT).toLowerCase() === 'no'
  return [
    ...getLandOwnershipFiles(session),
    ...getLegalAgreementFiles(session),
    getLandBoundaryFile(session),
    getFile(session, constants.redisKeys.METRIC_FILE_TYPE, constants.redisKeys.METRIC_FILE_SIZE, constants.redisKeys.METRIC_LOCATION, false),
    getFile(session, constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE, constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE, constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION, false),
    getFile(session, constants.redisKeys.HABITAT_PLAN_FILE_TYPE, constants.redisKeys.HABITAT_PLAN_FILE_SIZE, constants.redisKeys.HABITAT_PLAN_LOCATION, habitatPlanOptional),
    getFile(session, constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, writtenAuthorisationOptional)
  ]
}

const getLandOwnershipFiles = session => {
  const lopFiles = session.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS) || []
  return lopFiles.map(file => {
    delete file.id // Removing id because is excluded from application data validation
    return {
      ...file,
      optional: false
    }
  })
}

const getLocalPlanningAuthorities = lpas => {
  if (!lpas) return ''
  const lpasReference = getLpaNamesAndCodes()
  return lpas.map(e => { return { LPAName: e, LPAId: lpasReference.find(lpa => lpa.name === e).id } })
}
const getLegalAgreementFiles = session => {
  const legalAgreementFiles = session.get(constants.redisKeys.LEGAL_AGREEMENT_FILES) || []
  return legalAgreementFiles.map(file => ({
    contentMediaType: file.fileType,
    fileType: constants.uploadTypes.LEGAL_AGREEMENT_UPLOAD_TYPE,
    fileSize: file.fileSize,
    fileLocation: file.location,
    fileName: path.basename(file.location),
    optional: false
  }))
}
const getLandBoundaryFile = session => {
  if (session.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData') {
    const { fileSize, fileLocation, fileName } = getGeospatialFileAttributes(session)
    return {
      contentMediaType: 'application/geo+json',
      fileType: 'geojson',
      fileSize,
      fileLocation,
      fileName,
      optional: false
    }
  } else {
    return {
      contentMediaType: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE),
      fileType: 'land-boundary',
      fileSize: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE),
      fileLocation: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION),
      fileName: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION) && path.basename(session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)),
      optional: false
    }
  }
}

const getGeospatialFileAttributes = session => {
  if (session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION)) {
    return {
      fileSize: session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_FILE_SIZE),
      fileLocation: session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION),
      fileName: session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION) && path.basename(session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION)),
      optional: false
    }
  } else {
    return {
      fileSize: session.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE),
      fileLocation: session.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION),
      fileName: session.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION) && path.basename(session.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION)),
      optional: false
    }
  }
}

const getHectares = session => session.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData'
  ? session.get(constants.redisKeys.GEOSPATIAL_HECTARES)
  : session.get(constants.redisKeys.LAND_BOUNDARY_HECTARES)

const getGridReference = session => session.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData'
  ? session.get(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE)
  : session.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE)

const getApplicationReference = session => session.get(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE) || ''

const getPayment = session => {
  const payment = savePayment(session, paymentConstants.REGISTRATION, getApplicationReference(session))
  return {
    reference: payment.reference,
    method: payment.type
  }
}

const getLandowners = session => {
  const sessionLandowners = session.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
  const landownersByType = {
    organisation: [],
    individual: []
  }
  sessionLandowners?.forEach(landowner => {
    if (landowner.type === 'organisation') {
      landownersByType.organisation.push({
        organisationName: landowner.organisationName,
        email: landowner.emailAddress
      })
    } else if (landowner.type === 'individual') {
      landownersByType.individual.push({
        firstName: landowner.firstName,
        middleNames: landowner.middleNames,
        lastName: landowner.lastName,
        email: landowner.emailAddress
      })
    }
  })

  return landownersByType
}

const getGainSite = session => {
  const gainSiteReference = session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
  const metricData = session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)
  const habitat = metricData.habitatOffSiteGainSiteSummary.find(item => item['Gain site reference'] === gainSiteReference)
  const hedge = metricData.hedgeOffSiteGainSiteSummary.find(item => item['Gain site reference'] === gainSiteReference)
  const waterCourse = metricData.waterCourseOffSiteGainSiteSummary.find(item => item['Gain site reference'] === gainSiteReference)
  return {
    offsiteUnitChange: {
      habitat: habitat ? parseFloat(habitat['Habitat Offsite unit change per gain site (Post SRM)']) : 0,
      hedge: hedge ? parseFloat(hedge['Hedge Offsite unit change per gain site (Post SRM)']) : 0,
      watercourse: waterCourse ? parseFloat(waterCourse['Watercourse Offsite unit change per gain site (Post SRM)']) : 0
    }
  }
}

const getLpaCode = name => {
  const foundLpa = getLpaNamesAndCodes().find(lpa => lpa.name === name)
  return foundLpa ? foundLpa.id : null
}

const getAllocationHabitats = session => {
  const matchedHabitats = session.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)

  return {
    allocated: (matchedHabitats || []).map(m => {
      return {
        habitatId: m.matchedHabitatId,
        area: m.size,
        module: m.module,
        state: m.state,
        measurementUnits: m.measurementUnits
      }
    })
  }
}

const application = (session, account) => {
  const isLegalAgreementTypeS106 = session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) === '759150000'
  const stringOrNull = value => value ? String(value) : null
  const planningAuthorityName = stringOrNull(session.get(constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST))

  const applicationJson = {
    combinedCase: {
      applicant: getApplicant(account, session),
      registrationDetails: {
        habitats: getHabitats(session.get(constants.redisKeys.METRIC_DATA)),
        landBoundaryGridReference: getGridReference(session),
        landBoundaryHectares: getHectares(session),
        legalAgreementType: session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
        enhancementWorkStartDate: session.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY),
        legalAgreementEndDate: session.get(constants.redisKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY),
        habitatPlanIncludedLegalAgreementYesNo: session.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
        landowners: getLandowners(session),
        ...(!isLegalAgreementTypeS106 ? { conservationCovernantResponsibleBodies: session.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES) } : {}),
        ...(isLegalAgreementTypeS106 ? { planningObligationLPAs: getLocalPlanningAuthorities(session.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)) } : {})
      },
      allocationDetails: {
        gainSite: getGainSite(session),
        habitats: getAllocationHabitats(session),
        development: {
          localPlanningAuthority: {
            code: getLpaCode(planningAuthorityName),
            name: planningAuthorityName
          },
          planningReference: session.get(constants.redisKeys.DEVELOPER_PLANNING_APPLICATION_REF),
          name: session.get(constants.redisKeys.DEVELOPER_DEVELOPMENT_NAME)
        }
      },
      files: getFiles(session),
      applicationReference: getApplicationReference(session),
      submittedOn: new Date().toISOString(),
      payment: getPayment(session)
    }
  }

  if (applicationJson.combinedCase.applicant.role === constants.applicantTypes.AGENT) {
    applicationJson.combinedCase.agent = getClientDetails(session)
  } else if (applicationJson.combinedCase.applicant.role === constants.applicantTypes.LANDOWNER) {
    applicationJson.combinedCase.landownerAddress = getAddress(session)
  }

  if (session.get(constants.redisKeys.ORGANISATION_ID)) {
    applicationJson.combinedCase.organisation = getOrganisation(session)
  }

  // Filter blank files that are optional and remove the 'optional' property
  applicationJson.combinedCase.files = applicationJson.combinedCase.files
    .filter(file => !(file.optional && !file.fileLocation))
    .map(({ optional, ...restOfFile }) => restOfFile)

  return applicationJson
}

export default application