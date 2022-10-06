import constants from './constants.js'
import path from 'path'

const application = session => {
  return {
    landownerGainSiteRegistration: {
      applicant: {
        firstName: null,
        lastName: session.get(constants.redisKeys.FULL_NAME),
        role: session.get(constants.redisKeys.ROLE_KEY) === 'Other' ? `Other: ${session.get(constants.redisKeys.ROLE_OTHER)}` : session.get(constants.redisKeys.ROLE_KEY)
      },
      gainSiteReference: '',
      habitatWorkStartDate: session.get(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY),
      landBoundaryGridReference: session.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE),
      landBoundaryHectares: session.get(constants.redisKeys.LAND_BOUNDARY_HECTARES),
      legalAgreementParties: [
        {
          name: 'John Smith', // todo set to correct array
          role: 'role'
        }
      ],
      legalAgreementType: 759150000, // todo set to correct field ID
      legalAgreementStartDate: new Date().toISOString(), // todo set to correct field
      managementMonitoringStartDate: session.get(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY),
      submittedOn: new Date().toISOString(),
      files: [
        {
          contentMediaType: session.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_TYPE),
          fileType: 'legal-agreement',
          fileSize: session.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION),
          fileName: session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION) && path.basename(session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION))
        }, {
          contentMediaType: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE),
          fileType: 'land-boundary',
          fileSize: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION),
          fileName: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION) && path.basename(session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION))
        }, {
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
      ]
    }
  }
}

export default application
