import { CoordinateSystemValidationError, ThreatScreeningError, UploadTypeValidationError, ValidationError } from '@defra/bng-errors-lib'

export default data => {
  if (data.authorityKey) {
    throw new CoordinateSystemValidationError(data.authorityKey, data.errorCode)
  } else if (data.uploadType) {
    throw new UploadTypeValidationError(data.uploadType, data.errorCode)
  } else if (data.errorCode) {
    throw new ValidationError(data.errorCode)
  } else if (data.threatScreeningDetails) {
    throw new ThreatScreeningError(data.threatScreeningDetails)
  } else if (data.errorMessage) {
    throw new Error(data.errorMessage)
  }
}
