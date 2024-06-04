import setCreditsApplicationSession from '../../__mocks__/credits-application-session'
import creditsApplication from '../credits-application'
import creditsPurchaseConstants from '../credits-purchase-constants.js'
import constants from '../constants.js'
import applicant from '../../__mocks__/applicant'

describe('credits-application', () => {
  it('Should process typical application based on test data including LPA code', () => {
    const session = setCreditsApplicationSession()
    const app = creditsApplication(session, applicant)

    expect(app.creditsPurchase.creditReference).toEqual('ABC/123/456')
    expect(app.creditsPurchase.development.localPlanningAuthority.name).toEqual('Hartlepool LPA')
    expect(app.creditsPurchase.development.localPlanningAuthority.code).toEqual('E60000003')
    expect(app.creditsPurchase.development.name).toEqual('Eden')
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setCreditsApplicationSession()
    session.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE)
    const app = creditsApplication(session, applicant)

    expect(app.creditsPurchase.creditReference).toEqual(null)
  })

  it('Should include organisation id if organisation purchasing credits', () => {
    const session = setCreditsApplicationSession()
    const mockOrgId = 'testorg123'
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.ORGANISATION)
    session.set(constants.redisKeys.ORGANISATION_ID, mockOrgId)
    const app = creditsApplication(session, applicant)

    expect(app.creditsPurchase.organisation.id).toEqual(mockOrgId)
  })

  it('Should include indiviudal due diligence details if individual purchasing credits', () => {
    const session = setCreditsApplicationSession()
    const mockMiddleName = { middleName: 'Oliver' }
    const mockDateOfBirth = '1977-11-08'
    const mockDateOfBirthIso = `${mockDateOfBirth}Tabc`
    const mockSingleNationality = 'American'
    const mockNationalityArray = [mockSingleNationality, '', '', '']
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.INDIVIDUAL)
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME, mockMiddleName)
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH, mockDateOfBirthIso)
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY, mockNationalityArray)
    const app = creditsApplication(session, applicant)

    expect(app.creditsPurchase.applicant.middleName).toEqual(mockMiddleName.middleName)
    expect(app.creditsPurchase.applicant.dateOfBirth).toEqual(mockDateOfBirth)
    expect(app.creditsPurchase.applicant.nationality).toEqual([mockSingleNationality])
  })

  it('Should handle missing due diligence details if individual purchasing credits', () => {
    const session = setCreditsApplicationSession()
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.INDIVIDUAL)
    session.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME)
    session.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DATE_OF_BIRTH)
    session.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY)
    const app = creditsApplication(session, applicant)

    expect(app.creditsPurchase.applicant.middleName).toEqual(null)
    expect(app.creditsPurchase.applicant.dateOfBirth).toEqual(null)
    expect(app.creditsPurchase.applicant.nationality).toEqual([])
  })
})
