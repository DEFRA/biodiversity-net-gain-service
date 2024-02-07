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

    it('Should fail validation if a file is not optional and blank, also if IS_AGENT is true then written authorisation is mandatory', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.IS_AGENT, 'yes')
      session.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, null)
      session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, null)
      session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, null)
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error.message).toEqual('"landownerGainSiteRegistration.files[8].contentMediaType" must be a string')
      expect(value).not.toBeUndefined()
    })
    it('Should pass validation if a file is optional and blank, it should also delete the file', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.IS_AGENT, 'no')
      session.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, null)
      session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, null)
      session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, null)
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value.landownerGainSiteRegistration.files.length).toEqual(8)
    })

    it('Should pass validation with single individual landowner and no organisation', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
        type: 'individual',
        firstName: 'Geoff',
        middleNames: '',
        lastName: 'Hopkin',
        emailAddress: 'me@me.com'
      }])
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should pass validation with single individual landowner and no organisation', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
        type: 'organisation',
        organisationName: 'My Org'
      }])
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
  })
})
