import Session from './session.js'
import developerApplicationMock from './developer-application-data.js'
import constants from '../utils/constants.js'

const setDeveloperApplicationSession = () => {
  const session = new Session()
  const mockData = developerApplicationMock.developerAllocation
  session.set(constants.redisKeys.DEVELOPER_FULL_NAME, mockData.applicant.name)
  session.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, mockData.applicant.emailAddress)
  session.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockData.metricData)
  session.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, mockData.biodiversityGainSiteNumber)
  session.set(constants.redisKeys.METRIC_FILE_CHECKED, mockData.metricFileChecked)
  session.set(constants.redisKeys.CONFIRM_OFFSITE_GAIN_CHECKED, mockData.confirmOffsiteGainDetails)
  session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, mockData.files[0].fileType)
  session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, mockData.files[0].fileSize)
  session.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, mockData.files[0].fileLocation)
  session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, mockData.files[0].fileName)
  session.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, mockData.files[1].fileType)
  session.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, mockData.files[1].fileSize)
  session.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, mockData.files[1].fileLocation)
  session.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_NAME, mockData.files[1].fileName)
  session.set(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS, mockData.additionalEmailAddresses)
  session.set(constants.redisKeys.APPLICATION_REFERENCE, mockData.referenceNumber)
  return session
}

export default setDeveloperApplicationSession
