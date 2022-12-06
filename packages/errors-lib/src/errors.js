import CoordinateSystemValidationError from './coordinate-system-validation-error.js'
import ThreatScreeningError from './threat-screening-error.js'
import UploadTypeValidationError from './upload-type-validation-error.js'
import ValidationError from './validation-error.js'
import BlobBufferError from './blob-buffer-error.js'

const INVALID_COORDINATE_SYSTEM = 'INVALID-COORDINATE-SYSTEM'
const INVALID_FEATURE_COUNT = 'INVALID-FEATURE-COUNT'
const INVALID_LAYER_COUNT = 'INVALID-LAYER-COUNT'
const INVALID_UPLOAD = 'INVALID-UPLOAD'
const MISSING_COORDINATE_SYSTEM = 'MISSING-COORDINATE-SYSTEM'
const BUFFER_NOT_EXISTS = 'BUFFER-NOT-EXISTS'

const uploadGeospatialLandBoundaryErrorCodes = Object.freeze({
  INVALID_COORDINATE_SYSTEM,
  INVALID_FEATURE_COUNT,
  INVALID_LAYER_COUNT,
  INVALID_UPLOAD,
  MISSING_COORDINATE_SYSTEM,
  BUFFER_NOT_EXISTS
})

export { CoordinateSystemValidationError, ThreatScreeningError, UploadTypeValidationError, ValidationError, uploadGeospatialLandBoundaryErrorCodes, BlobBufferError }
