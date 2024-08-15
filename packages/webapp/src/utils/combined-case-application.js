import constants from './constants.js'
import paymentConstants from '../payment/constants.js'
import path from 'path'
import savePayment from '../payment/save-payment.js'
import { getLpaNamesAndCodes } from './get-lpas.js'
import { getApplicant, getFile, getGainSite, getClientDetails, getAddress, getHabitatsFromMetric } from './shared-application.js'

const getOrganisation = session => ({
  id: session.get(constants.redisKeys.ORGANISATION_ID),
  address: getAddress(session)
})

const getHabitats = metricData => getHabitatsFromMetric(metricData)

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
      applicant: getApplicant(account, session, constants.redisKeys.IS_AGENT),
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
