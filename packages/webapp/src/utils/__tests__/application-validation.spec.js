import applicationValidation from '../application-validation.js'
import application from '../application.js'
import constants from '../../utils/constants.js'
import applicationSession from '../../__mocks__/application-session.js'
import applicant from '../../__mocks__/applicant.js'

describe('application-validation', () => {
  describe('validate', () => {
    it('Should pass validation for normal test', () => {
      const session = applicationSession()
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should pass validation if HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO is Yes and Habitat Plan file is not uploaded', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'Yes')
      session.set(constants.redisKeys.HABITAT_PLAN_FILE_SIZE, null)
      session.set(constants.redisKeys.HABITAT_PLAN_LOCATION, null)
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO is No and Habitat Plan file is not uploaded', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO, 'No')
      session.set(constants.redisKeys.HABITAT_PLAN_FILE_SIZE, null)
      session.set(constants.redisKeys.HABITAT_PLAN_LOCATION, null)
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).not.toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should success validation if LEGAL_AGREEMENT_DOCUMENT_TYPE 759150000 for S106 flow', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should success validation if LEGAL_AGREEMENT_DOCUMENT_TYPE 759150001 for concov flow', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150001')
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if a .required() field is missing', () => {
      const session = applicationSession()
      const applicantCopy = JSON.parse(JSON.stringify(applicant))
      applicantCopy.idTokenClaims.contactId = ''
      const { value, error } = applicationValidation.validate(application(session, applicantCopy))
      expect(error.message).toEqual('"landownerGainSiteRegistration.applicant.id" is not allowed to be empty')
      expect(value).not.toBeUndefined()
    })
  })
})
