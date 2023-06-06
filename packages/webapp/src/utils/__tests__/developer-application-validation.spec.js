import developerApplicationValidation from '../developer-application-validation.js'
import developerApplication from '../developer-application.js'
import constants from '../../utils/constants.js'
import setDeveloperApplicationSession from '../../__mocks__/developer-application-session.js'

describe('developer-application-validation', () => {
  describe('validate', () => {
    it('Should pass validation for normal test', () => {
      const session = setDeveloperApplicationSession()
      const { value, error } = developerApplicationValidation.validate(developerApplication(session))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if a .required() field is missing', () => {
      const session = setDeveloperApplicationSession()
      session.set(constants.redisKeys.DEVELOPER_FULL_NAME, undefined)
      const { value, error } = developerApplicationValidation.validate(developerApplication(session))
      expect(error.message).toEqual('"developerAllocation.applicant.lastName" is required')
      expect(value).not.toBeUndefined()
    })
  })
})
