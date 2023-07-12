import developerApplicationValidation from '../developer-application-validation.js'
import developerApplication from '../developer-application.js'
import developerApplicationSession from '../../__mocks__/developer-application-session.js'
import applicant from '../../__mocks__/applicant.js'

describe('developer-application-validation', () => {
  describe('validate', () => {
    it('Should pass validation for normal test', () => {
      const session = developerApplicationSession()
      const { value, error } = developerApplicationValidation.validate(developerApplication(session, applicant))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if a .required() field is missing', () => {
      const session = developerApplicationSession()
      const applicantCopy = JSON.parse(JSON.stringify(applicant))
      applicantCopy.idTokenClaims.lastName = ''
      const { value, error } = developerApplicationValidation.validate(developerApplication(session, applicantCopy))
      expect(error.message).toEqual('"developerAllocation.applicant.lastName" is not allowed to be empty')
      expect(value).not.toBeUndefined()
    })
  })
})
