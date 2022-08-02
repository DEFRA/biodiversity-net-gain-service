const ABOUT = 'about'
const CHECK_LEGAL_AGREEMENT = 'land/check-legal-agreement'
const CONFIRM_GEOSPATIAL_LAND_BOUNDARY = 'land/confirm-land-boundary'
const DOCUMENT_UPLOAD = 'documentUpload'
const ERROR = 'error'
const GEOSPATIAL_DATA = 'geospatialData'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE = 'geospatial-land-boundary'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land/choose-land-boundary-upload-option'
const LEGAL_AGREEMENT_CHECKED = 'legal-agreement-checked'
const LEGAL_AGREEMENT_LOCATION = 'legal-agreement-location'
const NO = 'no'
const NO_AGAIN = 'noAgain'
const OS_API_TOKEN = 'land/os-api-token'
const LEGAL_AGREEMENT_UPLOAD_TYPE = 'legal-agreement'
const PUBLIC = 'public'
const SESSION = 'session'
const START = 'start'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const UPLOAD_LEGAL_AGREEMENT = 'land/upload-legal-agreement'
const YES = 'yes'

const confirmLandBoundaryOptions = {
  NO,
  NO_AGAIN,
  YES
}
const landBoundaryUploadTypes = {
  GEOSPATIAL_DATA,
  DOCUMENT_UPLOAD
}

const legalAgreementFileExt = [
  '.doc',
  '.docx',
  '.pdf'
]

const redisKeys = {
  LAND_BOUNDARY_LOCATION,
  LAND_BOUNDARY_MAP_CONFIG,
  LAND_BOUNDARY_UPLOAD_TYPE,
  LEGAL_AGREEMENT_CHECKED,
  LEGAL_AGREEMENT_LOCATION
}

const routes = {
  ABOUT,
  ERROR,
  CHECK_LEGAL_AGREEMENT,
  CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  GEOSPATIAL_LAND_BOUNDARY,
  LAND_BOUNDARY_UPLOAD_TYPE,
  OS_API_TOKEN,
  PUBLIC,
  SESSION,
  START,
  UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  UPLOAD_LEGAL_AGREEMENT
}

const uploadErrors = {
  noFile: 'Non-file received',
  unsupportedFileExt: 'Unsupported file extension'
}

const uploadTypes = {
  GEOSPATIAL_LAND_BOUNDARY_UPLOAD_TYPE,
  LEGAL_AGREEMENT_UPLOAD_TYPE
}

const views = Object.assign({}, routes)

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

export default Object.freeze({
  confirmLandBoundaryOptions,
  landBoundaryUploadTypes,
  legalAgreementFileExt,
  redisKeys,
  routes,
  views,
  uploadErrors,
  uploadTypes
})
