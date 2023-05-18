import { DuplicateApplicationReferenceError } from '../src/errors.js'

const applicationReference = 'mock application session ID'
const errorMessage = 'mock error message'

describe('Validation errors', () => {
  it('should supplement a standard Error with an application session ID', async () => {
    try {
      throw new DuplicateApplicationReferenceError(applicationReference, errorMessage)
    } catch (err) {
      expect(err.applicationReference).toBe(applicationReference)
      expect(err.message).toBe(errorMessage)
    }
  })
})
