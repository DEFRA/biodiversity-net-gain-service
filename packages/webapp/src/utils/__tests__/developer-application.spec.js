import setDeveloperApplicationSession from '../../__mocks__/developer-application-session'
import developerApplication from '../developer-application'
import constants from '../constants.js'
import applicant from '../../__mocks__/applicant'

describe('developer-application', () => {
  it('Creates payload for individual landowner', () => {
    const session = setDeveloperApplicationSession()
    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.allocationReference).toEqual('TEST-1234')
    expect(app.developerRegistration.files[0].fileType).toEqual('developer-upload-metric')
    expect(app.developerRegistration.isLandownerLeaseholder).toEqual('yes')
  })

  it('Adds organisation ID if an organisation logged in', () => {
    const orgId = 'ORG-ABC'
    const session = setDeveloperApplicationSession()
    session.set(constants.redisKeys.ORGANISATION_ID, orgId)
    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.organisation.id).toEqual(orgId)
    expect(app.developerRegistration.applicant.role).toEqual('organisation')
  })

  it('Adds client details if client application, and includes written authorisation', () => {
    const firstName = 'Geoff'
    const lastName = 'Hopkin'
    const fileLocationBase = 'mock-location/'
    const fileName = 'mock-name'
    const fileSize = '12345'
    const session = setDeveloperApplicationSession()

    session.set(constants.redisKeys.DEVELOPER_IS_AGENT, 'yes')
    session.set(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION, 'individual')
    session.set(constants.redisKeys.DEVELOPER_CLIENTS_NAME, { value: { firstName, lastName } })
    session.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE, 'developer-written-authorisation-file-type')
    session.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION, `${fileLocationBase}${fileName}`)
    session.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE, fileSize)

    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.applicant.role).toEqual('agent')
    expect(app.developerRegistration.agent.clientType).toEqual('individual')
    expect(app.developerRegistration.agent.clientNameIndividual.firstName).toEqual(firstName)
    expect(app.developerRegistration.agent.clientNameIndividual.lastName).toEqual(lastName)
    expect(app.developerRegistration.files[2].fileType).toEqual('developer-written-authorisation')
    expect(app.developerRegistration.files[2].fileName).toEqual(fileName)
    expect(app.developerRegistration.files[2].fileSize).toEqual(fileSize)
  })

  it('Add client organistion name if client is organisation', () => {
    const orgName = 'My Org 1234'
    const session = setDeveloperApplicationSession()

    session.set(constants.redisKeys.DEVELOPER_IS_AGENT, 'yes')
    session.set(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION, 'organisation')
    session.set(constants.redisKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME, orgName)

    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.applicant.role).toEqual('agent')
    expect(app.developerRegistration.agent.clientType).toEqual('organisation')
    expect(app.developerRegistration.agent.clientNameOrganisation).toEqual(orgName)
  })

  it('Adds consent file if not landowner', () => {
    const fileLocationBase = 'mock-location/'
    const fileName = 'mock-name'
    const fileSize = '12345'
    const session = setDeveloperApplicationSession()

    session.set(constants.redisKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER, 'no')
    session.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE, 'developer-upload-consent-file-type')
    session.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION, `${fileLocationBase}${fileName}`)
    session.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE, fileSize)
    session.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME, fileName)

    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.files[2].fileType).toEqual('developer-upload-consent')
    expect(app.developerRegistration.files[2].fileName).toEqual(fileName)
    expect(app.developerRegistration.files[2].fileSize).toEqual(fileSize)
    expect(app.developerRegistration.isLandownerLeaseholder).toEqual('no')
  })

  it('Adds default offsite unit change value if not available', () => {
    const session = setDeveloperApplicationSession()
    session.values['developer-metric-data'].habitatOffSiteGainSiteSummary = []
    session.values['developer-metric-data'].hedgeOffSiteGainSiteSummary = []
    session.values['developer-metric-data'].watercourseOffSiteGainSiteSummary = []
    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.gainSite.offsiteUnitChange.habitat).toEqual(0)
    expect(app.developerRegistration.gainSite.offsiteUnitChange.hedge).toEqual(0)
    expect(app.developerRegistration.gainSite.offsiteUnitChange.watercourse).toEqual(0)
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setDeveloperApplicationSession()
    session.clear(constants.redisKeys.DEVELOPER_APP_REFERENCE)

    const app = developerApplication(session, applicant)
    expect(app.developerRegistration.allocationReference).toEqual('')
  })
})
