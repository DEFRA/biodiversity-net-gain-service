const ABOUT = 'about'
const CHECK_LEGAL_AGREEMENT = 'land/check-legal-agreement'
const CONFIRM_GEOSPATIAL_LAND_BOUNDARY = 'land/confirm-land-boundary'
const DOCUMENT_UPLOAD = 'documentUpload'
const DOWNLOAD_LEGAL_AGREEMENT = 'land/check-legal-agreement/download'
const ERROR = 'error'
const GEOSPATIAL_DATA = 'geospatialData'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE = 'geospatial-land-boundary'
const GEOSPATIAL_LOCATION = 'geospatial-location'
const GEOSPATIAL_MAP_CONFIG = 'geospatial-map-config'
const GEOSPATIAL_UPLOAD_TYPE = 'land/choose-land-boundary-upload-option'
const LEGAL_AGREEMENT_CHECKED = 'legal-agreement-checked'
const LEGAL_AGREEMENT_FILE_SIZE = 'legal-agreement-file-size'
const LEGAL_AGREEMENT_LOCATION = 'legal-agreement-location'
const LEGAL_AGREEMENT_UPLOAD_TYPE = 'legal-agreement'
const NO = 'no'
const NO_AGAIN = 'noAgain'
const OS_API_TOKEN = 'land/os-api-token'
const PUBLIC = 'public'
const SESSION = 'session'
const START = 'start'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const UPLOAD_LEGAL_AGREEMENT = 'land/upload-legal-agreement'
const UPLOAD_LAND_BOUNDARY = 'land/upload-land-boundary'
const LAND_BOUNDARY_FILE_SIZE = 'legal-agreement-file-size'
const LAND_BOUNDARY_LOCATION = 'legal-agreement-location'
const CHECK_LAND_BOUNDARY = 'land/check-land-boundary'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land-boundary'
const YES = 'yes'

const confirmFileUploadOptions = {
  NO,
  NO_AGAIN,
  YES
}
const landBoundaryUploadTypes = {
  GEOSPATIAL_DATA,
  DOCUMENT_UPLOAD
}

const LEGAL_AGREMENT_FILE_EXT = [
  '.doc',
  '.docx',
  '.pdf'
]

const LEGAL_LAND_DOUNDARY_FILE_EXT = [
  '.doc',
  '.docx',
  '.jpg',
  '.png',
  '.pdf'
]

const redisKeys = {
  GEOSPATIAL_LOCATION,
  GEOSPATIAL_MAP_CONFIG,
  GEOSPATIAL_UPLOAD_TYPE,
  LEGAL_AGREEMENT_CHECKED,
  LEGAL_AGREEMENT_LOCATION,
  LEGAL_AGREEMENT_FILE_SIZE,
  LAND_BOUNDARY_LOCATION,
  LAND_BOUNDARY_FILE_SIZE
}

const routes = {
  ABOUT,
  ERROR,
  CHECK_LEGAL_AGREEMENT,
  CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  DOWNLOAD_LEGAL_AGREEMENT,
  GEOSPATIAL_LAND_BOUNDARY,
  GEOSPATIAL_UPLOAD_TYPE,
  OS_API_TOKEN,
  PUBLIC,
  SESSION,
  START,
  UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  UPLOAD_LEGAL_AGREEMENT,
  UPLOAD_LAND_BOUNDARY,
  CHECK_LAND_BOUNDARY
}

const uploadErrors = {
  noFile: 'Non-file received',
  unsupportedFileExt: 'Unsupported file extension'
}

const uploadTypes = {
  GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE,
  LEGAL_AGREEMENT_UPLOAD_TYPE,
  LAND_BOUNDARY_UPLOAD_TYPE
}

const views = Object.assign({ INTERNAL_SERVER_ERROR: '500' }, routes)

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

export default Object.freeze({
  confirmLandBoundaryOptions: confirmFileUploadOptions,
  confirmLegalAgreementOptions: confirmFileUploadOptions,
  legalAgreementFileExt: LEGAL_AGREMENT_FILE_EXT,
  landBoundaryFileExt: LEGAL_LAND_DOUNDARY_FILE_EXT,
  redisKeys,
  routes,
  views,
  uploadErrors,
  uploadTypes,
  landBoundaryUploadTypes
})
