import { CoordinateSystemValidationError } from '../src/errors.js'

const authorityKey = 'mock authority key'
const errorCode = 'mock error code'
const errorMessage = 'mock error message'

describe('Coordinate system validation errors', () => {
  it('should supplement a standard Error with an authority key and error code', async () => {
    try {
      throw new CoordinateSystemValidationError(authorityKey, errorCode, errorMessage)
    } catch (err) {
      expect(err.authorityKey).toBe(authorityKey)
      expect(err.code).toBe(errorCode)
      expect(err.message).toBe(errorMessage)
    }
  })
})
