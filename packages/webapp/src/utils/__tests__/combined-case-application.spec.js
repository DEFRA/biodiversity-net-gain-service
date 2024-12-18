import setApplicationSession from '../../__mocks__/combined-case-application-session'
import application from '../combined-case-application.js'
import constants from '../constants.js'
import account from '../../__mocks__/applicant.js'

describe('application', () => {
  let session

  beforeEach(() => {
    session = setApplicationSession()
  })

  it('Creates payload for individual landowner', () => {
    const app = application(session, account)
    expect(app.combinedCase.applicant.id).toEqual('1234567890')
    expect(app.combinedCase.files[0].fileType).toEqual('land-ownership')
    expect(app.combinedCase.applicant.role).toEqual('agent')
  })

  it('Adds organisation ID if an organisation logged in', () => {
    const orgId = 'ORG-XYZ'
    session.set(constants.redisKeys.ORGANISATION_ID, orgId)
    const app = application(session, account)
    expect(app.combinedCase.organisation.id).toEqual(orgId)
    expect(app.combinedCase.applicant.role).toEqual('agent')
  })

  it('Adds client details if applicant is agent, and includes written authorisation', () => {
    const firstName = 'John'
    const lastName = 'Doe'
    const fileLocation = 'mock-location/mock-file'
    const fileSize = '1024'

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

    session.set(constants.redisKeys.IS_AGENT, 'yes')
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, 'organisation')
    session.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY, orgName)

    const app = application(session, account)
    expect(app.combinedCase.applicant.role).toEqual('agent')
    expect(app.combinedCase.agent.clientType).toEqual('organisation')
    expect(app.combinedCase.agent.clientNameOrganisation).toEqual(orgName)
  })

  it('Adds default offsite unit change value if not available', () => {
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
    session.clear(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE)

    const app = application(session, account)
    expect(app.combinedCase.applicationReference).toEqual('')
  })

  it('Sets applicant role as "representative" if not an agent and has organisation id', () => {
    session.set(constants.redisKeys.IS_AGENT, 'no')
    session.set(constants.redisKeys.ORGANISATION_ID, '123')
    const app = application(session, account)
    expect(app.combinedCase.applicant.role).toEqual('representative')
  })

  it('Sets applicant role as "landowner" if not an agent and has no organisation id', () => {
    session.set(constants.redisKeys.IS_AGENT, 'no')
    session.set(constants.redisKeys.ORGANISATION_ID, null)
    const app = application(session, account)
    expect(app.combinedCase.applicant.role).toEqual('landowner')
  })

  it('Handles missing client name gracefully for organisation', () => {
    session.set(constants.redisKeys.IS_AGENT, 'yes')
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, 'organisation')
    session.clear(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY)

    const app = application(session, account)
    expect(app.combinedCase.agent.clientNameOrganisation).toBeUndefined()
  })

  it('Should set UK address', () => {
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.YES)
    session.set(constants.redisKeys.UK_ADDRESS_KEY, {
      addressLine1: 'addressLine1',
      town: 'town',
      addressLine2: 'addressLine2',
      addressLine3: 'addressLine3',
      postcode: 'postcode',
      county: 'county'
    })

    const app = application(session, account)
    expect(app.combinedCase.agent.clientAddress.type).toBe('uk')
  })

  it('Should set international address', () => {
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.NO)
    session.set(constants.redisKeys.NON_UK_ADDRESS_KEY, {
      addressLine1: 'addressLine1',
      town: 'town',
      addressLine2: 'addressLine2',
      addressLine3: 'addressLine3',
      postcode: 'postcode',
      county: 'county'
    })

    const app = application(session, account)
    expect(app.combinedCase.agent.clientAddress.type).toBe('international')
  })

  it('Should get local planning authorities', () => {
    session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
    session.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, ['County Durham LPA'])

    const app = application(session, account)
    expect(app.combinedCase.registrationDetails.planningObligationLPAs).toStrictEqual([{ LPAId: 'E60000001', LPAName: 'County Durham LPA' }]
    )
  })

  it('Should return empty array when no local planning authorities', () => {
    session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
    session.set(constants.redisKeys.PLANNING_AUTHORTITY_LIST, [])

    const app = application(session, account)
    expect(app.combinedCase.registrationDetails.planningObligationLPAs).toStrictEqual([])
  })

  it('Adds organisation client details', () => {
    const orgName = 'Client Org'

    session.set(constants.redisKeys.IS_AGENT, 'no')
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, 'organisation')
    session.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY, orgName)

    const app = application(session, account)
    expect(app.combinedCase.applicant.role).toEqual('landowner')
    expect(app.combinedCase.landownerAddress.type).toEqual('uk')
  })

  it('Adds allocated habitats', () => {
    const app = application(session, account)
    expect(app.combinedCase.allocationDetails.habitats.allocated.length).toEqual(5)
  })

  it('Calculates offsite unit change', () => {
    const app = application(session, account)
    const offsiteUnitChange = app.combinedCase.allocationDetails.gainSite.offsiteUnitChange
    expect(offsiteUnitChange.habitat).toEqual(10.59)
    expect(offsiteUnitChange.hedge).toEqual(9.47)
    expect(offsiteUnitChange.watercourse).toEqual(0)
  })
})
