import constants from './constants.js'
import path from 'path'
import { getLegalAgreementParties } from './helpers.js'

// Application object schema must match the expected payload format for the Operator application
const getApplicant = (session, account) => ({
  firstName: account.idTokenClaims.firstName,
  lastName: account.idTokenClaims.lastName,
  emailAddress: account.idTokenClaims.email,
  contactId: account.idTokenClaims.contactId
})

const getFile = (session, fileType, filesize, fileLocation) => ({
  contentMediaType: session.get(fileType),
  fileType: fileType.replace('-file-type', ''),
  fileSize: session.get(filesize),
  fileLocation: session.get(fileLocation),
  fileName: session.get(fileLocation) && path.basename(session.get(fileLocation))
})

const getFiles = session => [
  getFile(session, constants.redisKeys.LEGAL_AGREEMENT_FILE_TYPE, constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE, constants.redisKeys.LEGAL_AGREEMENT_LOCATION),
  getLandBoundaryFile(session),
  getFile(session, constants.redisKeys.MANAGEMENT_PLAN_FILE_TYPE, constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE, constants.redisKeys.MANAGEMENT_PLAN_LOCATION),
  getFile(session, constants.redisKeys.METRIC_FILE_TYPE, constants.redisKeys.METRIC_FILE_SIZE, constants.redisKeys.METRIC_LOCATION),
  getFile(session, constants.redisKeys.LAND_OWNERSHIP_FILE_TYPE, constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, constants.redisKeys.LAND_OWNERSHIP_LOCATION),
  getFile(session, constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE, constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE, constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION)
]
const otherLandowners = session => session.get(constants.redisKeys.LANDOWNERS) &&
  session.get(constants.redisKeys.LANDOWNERS).map(e => { return { name: e } })

const getLandBoundaryFile = session => {
  if (session.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData') {
    const { fileSize, fileLocation, fileName } = getGeospatialFileAttributes(session)
    return {
      contentMediaType: 'application/geo+json',
      fileType: 'geojson',
      fileSize,
      fileLocation,
      fileName
    }
  } else {
    return {
      contentMediaType: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE),
      fileType: 'land-boundary',
      fileSize: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE),
      fileLocation: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION),
      fileName: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION) && path.basename(session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION))
    }
  }
}

const getGeospatialFileAttributes = session => {
  if (session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION)) {
    return {
      fileSize: session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_FILE_SIZE),
      fileLocation: session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION),
      fileName: session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION) && path.basename(session.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION))
    }
  } else {
    return {
      fileSize: session.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE),
      fileLocation: session.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION),
      fileName: session.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION) && path.basename(session.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION))
    }
  }
}

const getHectares = session => session.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData'
  ? session.get(constants.redisKeys.GEOSPATIAL_HECTARES)
  : session.get(constants.redisKeys.LAND_BOUNDARY_HECTARES)

const getGridReference = session => session.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData'
  ? session.get(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE)
  : session.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE)

const application = (session, account) => {
  return {
    landownerGainSiteRegistration: {
      applicant: getApplicant(session, account),
      files: getFiles(session),
      gainSiteReference: session.get(constants.redisKeys.APPLICATION_REFERENCE) || '',
      habitatWorkStartDate: session.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY),
      landBoundaryGridReference: getGridReference(session),
      landBoundaryHectares: getHectares(session),
      legalAgreementParties: session.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES) && getLegalAgreementParties(session.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)),
      legalAgreementType: session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
      legalAgreementStartDate: session.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY),
      otherLandowners: otherLandowners(session) || [],
      managementMonitoringStartDate: session.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY),
      submittedOn: new Date().toISOString(),
      landownerConsent: session.get(constants.redisKeys.LANDOWNER_CONSENT_KEY) || 'false',
      metricData: session.get(constants.redisKeys.METRIC_DATA)
    }
  }
}

export default application
