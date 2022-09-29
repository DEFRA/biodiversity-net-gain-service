import constants from './constants.js'
import path from 'path'

const file = {
  contentMediaType: '',
  fileType: '',
  fileSize: '',
  fileLocation: '',
  fileName: ''
}

const application = (session) => {
  return {
    landownerGainSiteRegistration: {
      applicant: {
        firstName: null, // TODO
        lastName: null, // TODO
        role: null // TODO
      },
      gainSiteReference: null, // This will get generated on the function app
      landBoundaryGridReference: session.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE),
      landBoundaryHectares: session.get(constants.redisKeys.LAND_BOUNDARY_HECTARES),
      submittedOn: new Date().toISOString(),
      files: [
        {
          contentMediaType: session.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_TYPE),
          fileType: '1/legal-agreement',
          fileSize: session.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION),
          fileName: path.basename(session.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION))
        }, {
          contentMediaType: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE),
          fileType: '2/land-boundary',
          fileSize: session.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION),
          fileName: path.basename(session.get(constants.redisKeys.LAND_BOUNDARY_LOCATION))
        }, {
          contentMediaType: session.get(constants.redisKeys.MANAGEMENT_PLAN_FILE_TYPE),
          fileType: '3/management-plan',
          fileSize: session.get(constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION),
          fileName: path.basename(session.get(constants.redisKeys.MANAGEMENT_PLAN_LOCATION))
        }, {
          contentMediaType: session.get(constants.redisKeys.METRIC_FILE_TYPE),
          fileType: '4/metric',
          fileSize: session.get(constants.redisKeys.METRIC_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.METRIC_LOCATION),
          fileName: path.basename(session.get(constants.redisKeys.METRIC_LOCATION))
        }
      ]
    }
  }
}

export default application
