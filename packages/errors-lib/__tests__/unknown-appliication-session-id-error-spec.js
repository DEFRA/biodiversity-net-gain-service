import { UnknownApplicationSessionIdError } from '../src/errors.js'

const applicationSessionId = 'mock application session ID'
const errorMessage = 'mock error message'

describe('Validation errors', () => {
  it('should supplement a standard Error with an application session ID', async () => {
    try {
      throw new UnknownApplicationSessionIdError(applicationSessionId, errorMessage)
    } catch (err) {
      expect(err.applicationSessionId).toBe(applicationSessionId)
      expect(err.message).toBe(errorMessage)
    }
  })
})
