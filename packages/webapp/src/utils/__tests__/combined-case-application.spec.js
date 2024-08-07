import setApplicationSession from '../../__mocks__/combined-case-application-session'
import application from '../combined-case-application.js'
import constants from '../constants.js'
import account from '../../__mocks__/applicant.js'

describe('application', () => {
  it('Creates payload for individual landowner', () => {
    const session = setApplicationSession()
    const app = application(session, account)
    expect(app.combinedCase.applicant.id).toEqual('1234567890')
    expect(app.combinedCase.files[0].fileType).toEqual('land-ownership')
    expect(app.combinedCase.applicant.role).toEqual('agent')
  })

  it('Adds organisation ID if an organisation logged in', () => {
    const orgId = 'ORG-XYZ'
    const session = setApplicationSession()
    session.set(constants.redisKeys.ORGANISATION_ID, orgId)
    const app = application(session, account)
    expect(app.combinedCase.organisation.id).toEqual(orgId)
    expect(app.combinedCase.applicant.role).toEqual('agent')
  })

  it('Filters out habitats correctly based on gain site number', () => {
    const session = setApplicationSession()
    session.values[constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER] = 'GAIN-1234'

    const app = application(session, account)
    const habitat = app.combinedCase.allocationDetails.gainSite.offsiteUnitChange.habitat
    expect(habitat).toEqual(0)
  })

  it('Adds client details if applicant is agent, and includes written authorisation', () => {
    const firstName = 'John'
    const lastName = 'Doe'
    const fileLocation = 'mock-location/mock-file'
    const fileSize = '1024'
    const session = setApplicationSession()

    session.set(constants.redisKeys.IS_AGENT, 'yes')
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, 'individual')
    session.set(constants.redisKeys.CLIENTS_NAME_KEY, { value: { firstName, lastName } })
    session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, 'written-authorisation-file-type')
    session.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, fileLocation)
    session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, fileSize)

    const app = application(session, account)
    expect(app.combinedCase.applicant.role).toEqual('agent')
    expect(app.combinedCase.agent.clientType).toEqual('individual')
    expect(app.combinedCase.agent.clientNameIndividual.firstName).toEqual(firstName)
    expect(app.combinedCase.agent.clientNameIndividual.lastName).toEqual(lastName)
    expect(app.combinedCase.files.find(file => file.fileType === 'written-authorisation').fileName).toEqual('mock-file')
    expect(app.combinedCase.files.find(file => file.fileType === 'written-authorisation').fileSize).toEqual('1024')
  })

  it('Adds client organisation name if client is organisation', () => {
    const orgName = 'Client Org'
    const session = setApplicationSession()

    session.set(constants.redisKeys.IS_AGENT, 'yes')
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, 'organisation')
    session.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY, orgName)

    const app = application(session, account)
    expect(app.combinedCase.applicant.role).toEqual('agent')
    expect(app.combinedCase.agent.clientType).toEqual('organisation')
    expect(app.combinedCase.agent.clientNameOrganisation).toEqual(orgName)
  })

  it('Adds default offsite unit change value if not available', () => {
    const session = setApplicationSession()
    session.values[constants.redisKeys.DEVELOPER_METRIC_DATA] = {
      habitatOffSiteGainSiteSummary: [],
      hedgeOffSiteGainSiteSummary: [],
      waterCourseOffSiteGainSiteSummary: []
    }
    const app = application(session, account)
    expect(app.combinedCase.allocationDetails.gainSite.offsiteUnitChange.habitat).toEqual(0)
    expect(app.combinedCase.allocationDetails.gainSite.offsiteUnitChange.hedge).toEqual(0)
    expect(app.combinedCase.allocationDetails.gainSite.offsiteUnitChange.watercourse).toEqual(0)
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setApplicationSession()
    session.clear(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE)

    const app = application(session, account)
    expect(app.combinedCase.applicationReference).toEqual('')
  })
})
