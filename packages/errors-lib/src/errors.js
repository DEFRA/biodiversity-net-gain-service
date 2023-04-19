import CoordinateSystemValidationError from './coordinate-system-validation-error.js'
import ThreatScreeningError from './threat-screening-error.js'
import UnknownApplicationSessionIdError from './unknown-application-session-id-error.js'
import UploadTypeValidationError from './upload-type-validation-error.js'
import ValidationError from './validation-error.js'
import DuplicateApplicationReferenceError from './duplicate-application-reference-error.js'

const INVALID_COORDINATE_SYSTEM = 'INVALID-COORDINATE-SYSTEM'
const INVALID_FEATURE_COUNT = 'INVALID-FEATURE-COUNT'
const INVALID_LAYER_COUNT = 'INVALID-LAYER-COUNT'
const INVALID_UPLOAD = 'INVALID-UPLOAD'
const MISSING_COORDINATE_SYSTEM = 'MISSING-COORDINATE-SYSTEM'
const OUTSIDE_ENGLAND = 'OUTSIDE_ENGLAND'

const uploadGeospatialLandBoundaryErrorCodes = Object.freeze({
  INVALID_COORDINATE_SYSTEM,
  INVALID_FEATURE_COUNT,
  INVALID_LAYER_COUNT,
  INVALID_UPLOAD,
  MISSING_COORDINATE_SYSTEM,
  OUTSIDE_ENGLAND
})

export {
  CoordinateSystemValidationError,
  ThreatScreeningError,
  UnknownApplicationSessionIdError,
  UploadTypeValidationError,
  ValidationError,
  DuplicateApplicationReferenceError,
  uploadGeospatialLandBoundaryErrorCodes
}
