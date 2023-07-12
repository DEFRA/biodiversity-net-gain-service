import constants from './constants.js'
import path from 'path'
import { getLegalAgreementParties } from './helpers.js'

// Application object schema must match the expected payload format for the Operator application

const application = (session, account) => {
  return {
    landownerGainSiteRegistration: {
      applicant: {
        firstName: account.idTokenClaims.firstName,
        lastName: account.idTokenClaims.lastName,
        emailAddress: account.idTokenClaims.email,
        contactId: account.idTokenClaims.contactId
      },
      files: [
        {
          contentMediaType: session.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_TYPE),
          fileType: 'legal-agreement',
          fileSize: session.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION),
          fileName: session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION) && path.basename(session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION))
        }, getLandBoundaryFile(session), {
          contentMediaType: session.get(constants.redisKeys.MANAGEMENT_PLAN_FILE_TYPE),
          fileType: 'management-plan',
          fileSize: session.get(constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION),
          fileName: session.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION) && path.basename(session.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION))
        }, {
          contentMediaType: session.get(constants.redisKeys.METRIC_FILE_TYPE),
          fileType: 'metric',
          fileSize: session.get(constants.redisKeys.METRIC_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.METRIC_LOCATION),
          fileName: session.get(constants.redisKeys.METRIC_LOCATION) && path.basename(session.get(constants.redisKeys.METRIC_LOCATION))
        }, {
          contentMediaType: session.get(constants.redisKeys.LAND_OWNERSHIP_FILE_TYPE),
          fileType: 'land-ownership',
          fileSize: session.get(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.LAND_OWNERSHIP_LOCATION),
          fileName: session.get(constants.redisKeys.LAND_OWNERSHIP_LOCATION) && path.basename(session.get(constants.redisKeys.LAND_OWNERSHIP_LOCATION))
        }
      ],
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

export default application
