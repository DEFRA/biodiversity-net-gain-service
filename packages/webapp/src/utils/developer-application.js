import constants from './constants.js'
import path from 'path'

// Developer Application object schema must match the expected payload format for the Operator application
export default session => {
  return {
    developerAllocation: {
      applicant: {
        name: session.get(constants.redisKeys.DEVELOPER_FULL_NAME),
        emailAddress: session.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE),
        role: 'Developer'
      },
      developmentDetails: {
        projectName: session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)?.startPage.projectName,
        localAuthority: session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)?.startPage.planningAuthority,
        planningReference: session.get(constants.redisKeys.DEVELOPER_METRIC_DATA)?.startPage.planningApplicationReference
      },
      additionalEmailAddresses: session.get(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS) || [],
      biodiversityGainSiteNumber: session.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER),
      metricData: session.get(constants.redisKeys.DEVELOPER_METRIC_DATA),
      referenceNumber: session.get(constants.redisKeys.DEVELOPER_APP_REFERENCE) || '', // Need to get one after submitting application
      submittedOn: new Date().toISOString(),
      files: [
        {
          contentMediaType: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE),
          fileType: 'developer-upload-metric',
          fileSize: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION),
          fileName: session.get(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME) && path.basename(session.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION))
        },
        {
          contentMediaType: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE),
          fileType: 'developer-upload-consent',
          fileSize: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE),
          fileLocation: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION),
          fileName: session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_NAME) && path.basename(session.get(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION))
        }
      ]
    }
  }
}
