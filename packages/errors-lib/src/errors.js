import ThreatScreeningError from './threat-screening-error.js'
import MalwareDetectedError from './malware-detected-error.js'
import UnknownApplicationSessionIdError from './unknown-application-session-id-error.js'
import UploadTypeValidationError from './upload-type-validation-error.js'
import ValidationError from './validation-error.js'
import DuplicateApplicationReferenceError from './duplicate-application-reference-error.js'

const INVALID_UPLOAD = 'INVALID-UPLOAD'
const EMPTY_FILE_UPLOAD = 'EMPTY_FILE_UPLOAD'

const uploadWrittenConsentErrorCodes = Object.freeze({
  INVALID_UPLOAD,
  EMPTY_FILE_UPLOAD
})

export {
  ThreatScreeningError,
  MalwareDetectedError,
  UnknownApplicationSessionIdError,
  UploadTypeValidationError,
  ValidationError,
  DuplicateApplicationReferenceError,
  uploadWrittenConsentErrorCodes
}
