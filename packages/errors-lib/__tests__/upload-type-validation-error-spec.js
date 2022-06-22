import { UploadTypeValidationError } from '../src/errors.js'

const uploadType = 'mock upload type'
const errorCode = 'mock error code'
const errorMessage = 'mock error message'

describe('Upload type validation errors', () => {
  it('should supplement a standard Error with an upload type and error code', async () => {
    try {
      throw new UploadTypeValidationError(uploadType, errorCode, errorMessage)
    } catch (err) {
      expect(err.uploadType).toBe(uploadType)
      expect(err.code).toBe(errorCode)
      expect(err.message).toBe(errorMessage)
    }
  })
})
