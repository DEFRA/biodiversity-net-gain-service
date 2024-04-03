import setCreditsApplicationSession from '../../__mocks__/credits-application-session'
import creditsApplication from '../credits-application'
import creditsApplicationValidation from '../credits-application-validation.js'
import applicant from '../../__mocks__/applicant'
import creditsPurchaseConstants from '../credits-purchase-constants.js'
import constants from '../constants.js'

describe('credits-application-validation', () => {
  describe('validate', () => {
    it('Should pass validation for normal test', () => {
      const session = setCreditsApplicationSession()
      const app = creditsApplication(session, applicant)
      const { value, error } = creditsApplicationValidation.validate(app)
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })

    it('Should fail validation if a .required() field is missing', () => {
      const session = setCreditsApplicationSession()
      const applicantCopy = JSON.parse(JSON.stringify(applicant))
      applicantCopy.idTokenClaims.contactId = ''

      const app = creditsApplication(session, applicantCopy)
      const { value, error } = creditsApplicationValidation.validate(app)

      expect(error.message).toEqual('"creditsPurchase.applicant.id" is not allowed to be empty')
      expect(value).not.toBeUndefined()
    })

    it('Should contain all properties except organisation if individual application', () => {
      const session = setCreditsApplicationSession()
      const app = creditsApplication(session, applicant)
      const { value, error } = creditsApplicationValidation.validate(app)
      expect(error).toBeUndefined()
      expect(value.creditsPurchase.organisation).toBeUndefined()
      expect(value.creditsPurchase.applicant).not.toBeUndefined()
      expect(value.creditsPurchase.development).not.toBeUndefined()
      expect(value.creditsPurchase.products).not.toBeUndefined()
      expect(value.creditsPurchase.purchaseOrderNumber).not.toBeUndefined()
      expect(value.creditsPurchase.files).not.toBeUndefined()
      expect(value.creditsPurchase.creditReference).not.toBeUndefined()
      expect(value.creditsPurchase.submittedOn).not.toBeUndefined()
    })

    it('Should contain organisation if organisation application', () => {
      const session = setCreditsApplicationSession()
      const mockOrgId = 'testorg123'
      session.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.ORGANISATION)
      session.set(constants.cacheKeys.ORGANISATION_ID, mockOrgId)
      const app = creditsApplication(session, applicant)
      const { value, error } = creditsApplicationValidation.validate(app)
      expect(error).toBeUndefined()
      expect(value.creditsPurchase.organisation.id).toBe(mockOrgId)
    })

    it('Should not contain middle name, dob, nationality if organisation application session data absent', () => {
      const session = setCreditsApplicationSession()
      session.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.ORGANISATION)
      session.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_MIDDLE_NAME)
      session.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_DATE_OF_BIRTH)
      session.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_NATIONALITY)
      const app = creditsApplication(session, applicant)
      const { value, error } = creditsApplicationValidation.validate(app)
      expect(error).toBeUndefined()
      expect(value.creditsPurchase.applicant.middleName).toBeUndefined()
      expect(value.creditsPurchase.applicant.dateOfBirth).toBeUndefined()
      expect(value.creditsPurchase.applicant.nationality).toBeUndefined()
    })

    it('Should contain middle name, dob, nationality if session data absent for individual application', () => {
      const session = setCreditsApplicationSession()
      session.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_USER_TYPE, creditsPurchaseConstants.applicantTypes.INDIVIDUAL)
      session.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_MIDDLE_NAME)
      session.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_DATE_OF_BIRTH)
      session.clear(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_NATIONALITY)
      const app = creditsApplication(session, applicant)
      const { value, error } = creditsApplicationValidation.validate(app)
      expect(error).toBeUndefined()
      expect(value.creditsPurchase.applicant.middleName).toBeNull()
      expect(value.creditsPurchase.applicant.dateOfBirth).toBeNull()
      expect(value.creditsPurchase.applicant.nationality).toEqual([])
    })
  })
})
