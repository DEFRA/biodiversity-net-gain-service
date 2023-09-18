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
    it('Should fail validation if a .required() field is missing', () => {
      const session = applicationSession()
      const applicantCopy = JSON.parse(JSON.stringify(applicant))
      applicantCopy.idTokenClaims.lastName = ''
      const { value, error } = applicationValidation.validate(application(session, applicantCopy))
      expect(error.message).toEqual('"landownerGainSiteRegistration.applicant.lastName" is not allowed to be empty')
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if not a landowner and otherLandowners is empty', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LANDOWNERS, [])
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error.message).toEqual('"landownerGainSiteRegistration.otherLandowners" must contain at least 1 items')
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if otherLandowners and landownerConsent is false', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LANDOWNERS, ['test1', 'test2'])
      session.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, 'false')
      const { value, error } = applicationValidation.validate(application(session, applicant))
      expect(error.message).toEqual('"landownerGainSiteRegistration.landownerConsent" must be [true]')
      expect(value).not.toBeUndefined()
    })
  })
})
