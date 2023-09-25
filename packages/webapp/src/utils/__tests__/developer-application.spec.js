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
    session.set(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS, [
      {
        fullName: 'Test User',
        email: 'test@example.com'
      }
    ])
    const app = developerApplication(session, applicant)
    expect(app.developerAllocation.files[0].fileType).toEqual('developer-upload-metric')
    expect(app.developerAllocation.files[0].fileSize).toEqual(5131037)
    expect(app.developerAllocation.additionalEmailAddresses).toEqual([{ fullName: 'Test User', email: 'test@example.com' }])
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setDeveloperApplicationSession()
    session.clear(constants.redisKeys.APPLICATION_REFERENCE)
    session.clear(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS)

    const app = developerApplication(session, applicant)
    expect(app.developerAllocation.gainSiteReference).toEqual('')
    expect(app.developerAllocation.additionalEmailAddresses).toEqual([])
  })
})
