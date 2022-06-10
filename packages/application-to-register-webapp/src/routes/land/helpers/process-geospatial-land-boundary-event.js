import { CoordinateSystemValidationError, ValidationError } from '@defra/bng-errors-lib'

export default data => {
  if (data.authorityKey) {
    throw new CoordinateSystemValidationError(data.authorityKey, data.errorCode)
  } else if (data.errorCode) {
    throw new ValidationError(data.errorCode)
  } else if (data.errorMessage) {
    throw new Error(data.errorMessage)
  }
}
