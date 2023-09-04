import applicationValidation from '../application-validation.js'
import application from '../application.js'
import constants from '../../utils/constants.js'
import applicationSession from '../../__mocks__/application-session.js'

describe('application-validation', () => {
  describe('validate', () => {
    it('Should pass validation for normal test', () => {
      const session = applicationSession()
      const { value, error } = applicationValidation.validate(application(session))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if a .required() field is missing', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.FULL_NAME, undefined)
      const { value, error } = applicationValidation.validate(application(session))
      expect(error.message).toEqual('"landownerGainSiteRegistration.applicant.lastName" is required')
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if not a landowner and otherLandowners is empty', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LANDOWNERS, [])
      const { value, error } = applicationValidation.validate(application(session))
      expect(error.message).toEqual('"landownerGainSiteRegistration.otherLandowners" must contain at least 1 items')
      expect(value).not.toBeUndefined()
    })

    it('Should fail validation if otherLandowners and landownerConsent is false', () => {
      const session = applicationSession()
      session.set(constants.redisKeys.LANDOWNERS, ['test1', 'test2'])
      session.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, 'false')
      const { value, error } = applicationValidation.validate(application(session))
      expect(error.message).toEqual('"landownerGainSiteRegistration.landownerConsent" must be [true]')
      expect(value).not.toBeUndefined()
    })
  })
})
