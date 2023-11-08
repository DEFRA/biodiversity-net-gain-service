import constants from './constants.js'
import paymentConstants from '../payment/constants.js'
import path from 'path'
import savePayment from '../payment/save-payment.js'

// Application object schema must match the expected payload format for the Operator application
const getApplicant = account => ({
  id: account.idTokenClaims.contactId,
  role: 'Individual'
})

const getHabitats = session => {
  const metricData = session.get(constants.redisKeys.METRIC_DATA)
  const baselineIdentifiers = ['d1', 'e1', 'f1']
  const proposedIdentifiers = ['d2', 'e2', 'f2', 'd3', 'e3', 'f3']

  const getState = (identifier) => {
    switch (identifier.charAt(0)) {
      case 'd':
        return 'Habitat'
      case 'e':
        return 'Hedge'
      case 'f':
        return 'Watercourse'
    }
  }

  const getModule = (identifier) => {
    switch (identifier.charAt(identifier.length - 1)) {
      case '2':
        return 'Created'
      case '3':
        return 'Enhanced'
    }
  }

  const baseline = baselineIdentifiers.flatMap(identifier =>
    metricData[identifier].filter(details => 'Baseline ref' in details).map(details => ({
      habitatType: details['Habitat type'] ?? details['Watercourse type'] ?? details['Hedgerow type'],
      baselineReference: String(details['Baseline ref']),
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
      proposedHabitatId: details['Habitat reference Number'],
      habitatType: details['Habitat type'] ?? details['Watercourse type'] ?? details['Proposed habitat'],
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
  return [
    ...getLegalAgreementFiles(session),
    getLandBoundaryFile(session),
    getFile(session, constants.redisKeys.MANAGEMENT_PLAN_FILE_TYPE, constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE, constants.redisKeys.MANAGEMENT_PLAN_LOCATION, false),
    getFile(session, constants.redisKeys.METRIC_FILE_TYPE, constants.redisKeys.METRIC_FILE_SIZE, constants.redisKeys.METRIC_LOCATION, false),
    getFile(session, constants.redisKeys.LAND_OWNERSHIP_FILE_TYPE, constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, constants.redisKeys.LAND_OWNERSHIP_LOCATION, false),
    getFile(session, constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE, constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE, constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION, false),
    getFile(session, constants.redisKeys.HABITAT_PLAN_FILE_TYPE, constants.redisKeys.HABITAT_PLAN_FILE_SIZE, constants.redisKeys.HABITAT_PLAN_LOCATION, habitatPlanOptional)
  ]
}

const otherLandowners = session => session.get(constants.redisKeys.LANDOWNERS) &&
  session.get(constants.redisKeys.LANDOWNERS).map(e => { return { name: e } })

const getLocalPlanningAuthorities = lpas => {
  if (!lpas) return ''
  return lpas.map(e => { return { localPlanningAuthorityName: e } })
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

const getApplicationReference = session => session.get(constants.redisKeys.APPLICATION_REFERENCE) || ''

const getPayment = session => {
  const payment = savePayment(session, paymentConstants.REGISTRATION, getApplicationReference(session))
  return {
    reference: payment.reference,
    method: payment.type
  }
}

const application = (session, account) => {
  const isLegalAgreementTypeS106 = session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE) === '759150000'
  return {
    landownerGainSiteRegistration: {
      applicant: getApplicant(account),
      habitats: getHabitats(session),
      files: getFiles(session),
      gainSiteReference: getApplicationReference(session),
      landBoundaryGridReference: getGridReference(session),
      landBoundaryHectares: getHectares(session),
      legalAgreementType: session.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
      enhancementWorkStartDate: session.get(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY),
      legalAgreementEndDate: session.get(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY),
      habitatPlanIncludedLegalAgreementYesNo: session.get(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO),
      otherLandowners: otherLandowners(session) || [],
      legalAgreementLandowners: session.get(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS),
      ...(!isLegalAgreementTypeS106 ? { legalAgreementResponsibleBodies: session.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES) } : {}),
      ...(isLegalAgreementTypeS106 ? { legalAgreementPlanningAuthorities: getLocalPlanningAuthorities(session.get(constants.redisKeys.PLANNING_AUTHORTITY_LIST)) } : {}),
      managementMonitoringStartDate: session.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY),
      submittedOn: new Date().toISOString(),
      landownerConsent: session.get(constants.redisKeys.LANDOWNER_CONSENT_KEY) || 'false',
      payment: getPayment(session)
    }
  }
}

export default application
