import CoordinateSystemValidationError from './coordinate-system-validation-error.js'
import ThreatScreeningError from './threat-screening-error.js'
import UploadTypeValidationError from './upload-type-validation-error.js'
import ValidationError from './validation-error.js'

const INVALID_COORDINATE_SYSTEM = 'INVALID-COORDINATE-SYSTEM'
const INVALID_FEATURE_COUNT = 'INVALID-FEATURE-COUNT'
const INVALID_LAYER_COUNT = 'INVALID-LAYER-COUNT'
const MISSING_COORDINATE_SYSTEM = 'MISSING-COORDINATE-SYSTEM'

const uploadGeospatialLandBoundaryErrorCodes = Object.freeze({
  INVALID_COORDINATE_SYSTEM,
  INVALID_FEATURE_COUNT,
  INVALID_LAYER_COUNT,
  MISSING_COORDINATE_SYSTEM
})

export { CoordinateSystemValidationError, ThreatScreeningError, UploadTypeValidationError, ValidationError, uploadGeospatialLandBoundaryErrorCodes }
