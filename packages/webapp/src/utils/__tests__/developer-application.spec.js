import setDeveloperApplicationSession from '../../__mocks__/developer-application-session'
import developerApplication from '../developer-application'
import constants from '../constants.js'
import applicant from '../../__mocks__/applicant'

describe('developer-application', () => {
  it('Should set the metric file has been uploaded', () => {
    const session = setDeveloperApplicationSession()
    session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, 5131037)
    session.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, 'mock/developer-upload-metric/Sample Metric File.xlsm')
    session.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, 'developer-upload-metric')
    const app = developerApplication(session, applicant)
    expect(app.developerAllocation.files[0].fileType).toEqual('developer-upload-metric')
    expect(app.developerAllocation.files[0].fileSize).toEqual(5131037)
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setDeveloperApplicationSession()
    session.clear(constants.redisKeys.DEVELOPER_APP_REFERENCE)

    const app = developerApplication(session, applicant)
    expect(app.developerAllocation.allocationReference).toEqual('')
  })
})
